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
    const selectQuery = 'SELECT * FROM player WHERE id = $1';
    // Selects player based on ID
    const selectResult = await pool.query(selectQuery, [playerId]);;
    // Retrieve stats object in player
    let playerStats = selectResult.rows[0]?.stats;

    // Check if player exists and has hardpoint stats
    if (!playerStats || !playerStats.hardpoint) {
        throw new Error('Player or hardpoint stats are not available');
    };

    // Add new match to hardpoint stats
    playerStats.hardpoint.matches.push(matchData);
    // Update overall gamemode stats
    playerStats.hardpoint.totalKills += matchData.kills;
    playerStats.hardpoint.totalDeaths += matchData.deaths;

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
    const selectQuery = 'SELECT * FROM player WHERE id = $1';
    // Selects player based on ID
    const selectResult = await pool.query(selectQuery, [playerId]);;
    // Retrieve stats object in player
    let playerStats = selectResult.rows[0]?.stats;

    // Check if player exists and has snd stats
    if (!playerStats || !playerStats.snd) {
        throw new Error('Player or SnD stats are not available');
    };

    // Add new match to snd stats
    playerStats.snd.matches.push(matchData);
    // Update overall gamemode stats
    playerStats.snd.totalKills += matchData.kills;
    playerStats.snd.totalDeaths += matchData.deaths;

    // Update the player's OVERALL stats in the database
    const updateQuery = 'UPDATE players SET stats = $1 WHERE id = $2';
    await pool.query(updateQuery, [playerStats, playerId]);

    return playerStats;
}

/**
 * DELETE request for a single hardpoint match
 * @param {number} matchId 
 */
exports.deleteHardpointMatch = async (matchId) => {
    const deleteQuery = 'DELETE FROM hardpointMatches WHERE id = $1';
    const value = [matchId]
    await pool.query(deleteQuery, value);
}

/**
 * DELETE request for a single SnD match
 * @param {number} matchId 
 */
exports.deleteSndMatch = async (matchId) => {
    const deleteQuery = 'DELETE FROM sndMatches WHERE id = $1';
    const value = [matchId]
    await pool.query(deleteQuery, value);
}