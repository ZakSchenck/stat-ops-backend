const pool = require('../config/dbPool');

// MATCH requests

// GET request for retrieving all hardpoint matches
exports.getAllHardpointMatches = async () => {
    const queryResult = await pool.query('SELECT * FROM hardpointMatches');
    return queryResult.rows;
}

// GET request for retrieving all SnD matches
exports.getAllSndMatches = async () => {
    const queryResult = await pool.query('SELECT * from sndMatches');
    return queryResult.rows;
}

/**
 * POST request for creating a new Hardpoint match in player profile
 * @param {number} playerId 
 * @param {object} matchData 
 * @returns {object}
 */
exports.addHardpointMatch = async (playerId, matchData) => {
    const selectQuery = 'SELECT * FROM players WHERE id = $1';
    // Selects player based on ID
    const selectResult = await pool.query(selectQuery, [playerId]);;
    // Retrieve stats object in player
    let playerStats = selectResult.rows[0]?.stats;

    // Check if player exists and has hardpoint stats
    if (!playerStats || !playerStats.hardpoint) {
        throw new Error('Player or hardpoint stats are not available');
    };

    const insertMatchQuery = 'INSERT INTO hardpointmatches (kills, deaths, hilltime, won) VALUES ($1, $2, $3, $4) RETURNING id';
    const matchResult = await pool.query(insertMatchQuery, [matchData.kills, matchData.deaths, matchData.hillTime, matchData.won]);

    // Add new match id to matchData before pushing to player stats
    matchData.id = matchResult.rows[0].id;
    playerStats.hardpoint.matches.push(matchData);
    // Update overall gamemode stats
    playerStats.hardpoint.totalKills += matchData.kills;
    playerStats.hardpoint.totalDeaths += matchData.deaths;

    if (matchData.won) {
        playerStats.hardpoint.wins = (playerStats.hardpoint.wins || 0) + 1;
    } else {
        playerStats.hardpoint.losses = (playerStats.hardpoint.losses || 0) + 1;
    }

    // Update the player's OVERALL stats in the database
    const updateQuery = 'UPDATE players SET stats = $1 WHERE id = $2';
    await pool.query(updateQuery, [playerStats, playerId]);

    return playerStats;
}

/**
 * POST request for creating a new SnD match in player profile
 * @param {number} playerId 
 * @param {object} matchData 
 * @returns {object}
 */
exports.addSndMatch = async (playerId, matchData) => {
    const selectQuery = 'SELECT * FROM players WHERE id = $1';
    const selectResult = await pool.query(selectQuery, [playerId]);

    // Check if player exists
    if (selectResult.rows.length === 0) {
        throw new Error('Player not found');
    }

    // Retrieve and check stats object in player
    let playerStats = selectResult.rows[0]?.stats;
    if (!playerStats || !playerStats.snd) {
        throw new Error('Player or SnD stats are not available');
    }

    // Insert new match into sndmatches table
    const insertMatchQuery = 'INSERT INTO sndmatches (kills, deaths, plants, defuses, won) VALUES ($1, $2, $3, $4, $5) RETURNING id';
    const matchResult = await pool.query(insertMatchQuery, [matchData.kills, matchData.deaths, matchData.plants, matchData.defuses, matchData.won]);

    // Add new match id to matchData before pushing to player stats
    matchData.id = matchResult.rows[0].id;
    playerStats.snd.matches.push(matchData);

    // Update overall gamemode stats
    playerStats.snd.totalKills += matchData.kills;
    playerStats.snd.totalDeaths += matchData.deaths;
    playerStats.snd.plants += matchData.plants;
    playerStats.snd.defuses += matchData.defuses;
    if (matchData.won) {
        playerStats.snd.wins = (playerStats.snd.wins || 0) + 1;
    } else {
        playerStats.snd.losses = (playerStats.snd.losses || 0) + 1;
    }

    // Update the player's OVERALL stats in the database
    const updatePlayerQuery = 'UPDATE players SET stats = $1 WHERE id = $2';
    await pool.query(updatePlayerQuery, [JSON.stringify(playerStats), playerId]);

    return playerStats;
}

/**
 * DELETE request for a single hardpoint match
 * @param {number} matchId 
 */
exports.deleteHardpointMatch = async (matchId, playerId) => {
    // Retrieve match details
    const matchSelectQuery = 'SELECT * FROM hardpointmatches WHERE id = $1';
    const matchSelectResult = await pool.query(matchSelectQuery, [matchId]);
    if (matchSelectResult.rows.length === 0) {
        throw new Error('Match not found');
    }

    // Retrieve player stats
    const playerSelectQuery = 'SELECT * FROM players WHERE id = $1';
    const playerResult = await pool.query(playerSelectQuery, [playerId]);
    if (playerResult.rows.length === 0) {
        throw new Error('Player not found');
    }
    let playerStats = playerResult.rows[0].stats;

    // Check if the match ID exists in the player's hardpoint matches
    const matchIndex = playerStats.hardpoint.matches.findIndex(m => m.id === Number(matchId));
    if (matchIndex === -1) {
        throw new Error(`Match with ID ${matchId} not found in player's stats`);
    }

    playerStats.hardpoint.totalKills -= matchSelectResult.rows[0].kills;
    playerStats.hardpoint.totalDeaths -= matchSelectResult.rows[0].deaths;
    playerStats.hardpoint.plants -= matchSelectResult.rows[0].hillTime;
    if (matchSelectResult.rows[0].won) {
        playerStats.hardpoint.wins = (playerStats.hardpoint.wins || 0) + 1;
    } else {
        playerStats.hardpoint.losses = (playerStats.hardpoint.losses || 0) + 1;
    }

    // Remove the match from the player's stats
    playerStats.hardpoint.matches.splice(matchIndex, 1);

    // Update the player's stats in the database
    const playerUpdateQuery = 'UPDATE players SET stats = $1 WHERE id = $2';
    await pool.query(playerUpdateQuery, [JSON.stringify(playerStats), playerId]);
    
    // Finally, delete the match from the hardpointmatches table
    const deleteQuery = 'DELETE FROM hardpointmatches WHERE id = $1';
    const deleteResult = await pool.query(deleteQuery, [matchId]);
    
    const affectedRows = deleteResult.rowCount;

    return affectedRows;
}

/**
 * DELETE request for a single SnD match
 * @param {number} matchId 
 */
exports.deleteSndMatch = async (matchId, playerId) => {
    // Retrieve match details
    const matchSelectQuery = 'SELECT * FROM sndmatches WHERE id = $1';
    const matchSelectResult = await pool.query(matchSelectQuery, [matchId]);
    if (matchSelectResult.rows.length === 0) {
        throw new Error('Match not found');
    }

    // Retrieve player stats
    const playerSelectQuery = 'SELECT * FROM players WHERE id = $1';
    const playerResult = await pool.query(playerSelectQuery, [playerId]);
    if (playerResult.rows.length === 0) {
        throw new Error('Player not found');
    }
    let playerStats = playerResult.rows[0].stats;

    // Check if the match ID exists in the player's snd matches
    const matchIndex = playerStats.snd.matches.findIndex(m => m.id === Number(matchId));
    if (matchIndex === -1) {
        throw new Error(`Match with ID ${matchId} not found in player's stats`);
    }

    playerStats.snd.totalKills -= matchSelectResult.rows[0].kills;
    playerStats.snd.totalDeaths -= matchSelectResult.rows[0].deaths;
    playerStats.snd.plants -= matchSelectResult.rows[0].plants;
    playerStats.snd.defuses -= matchSelectResult.rows[0].defuses;
    if (matchSelectResult.rows[0].won) {
        playerStats.snd.wins = (playerStats.snd.wins || 0) + 1;
    } else {
        playerStats.snd.losses = (playerStats.snd.losses || 0) + 1;
    }

    // Remove the match from the player's stats
    playerStats.snd.matches.splice(matchIndex, 1);

    // Update the player's stats in the database
    const playerUpdateQuery = 'UPDATE players SET stats = $1 WHERE id = $2';
    await pool.query(playerUpdateQuery, [JSON.stringify(playerStats), playerId]);
    
    // Finally, delete the match from the sndmatches table
    const deleteQuery = 'DELETE FROM sndmatches WHERE id = $1';
    const deleteResult = await pool.query(deleteQuery, [matchId]);
    
    const affectedRows = deleteResult.rowCount;

    return affectedRows;
}