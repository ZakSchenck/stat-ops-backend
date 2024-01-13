const pool = require('../config/dbPool');

// PLAYER REQUESTS
// Model for GET all players
exports.getAllPlayers = async (userId) => {
    const queryResult = await pool.query('SELECT * FROM players WHERE user_id = $1', [userId]);
    return queryResult.rows;
}

/**
 * POST request model for creating a new player
 * @param {playerData} object
 * @returns {object}
 */
exports.createNewPlayer = async (playerData) => {
    // SQL Query for inserting new player - Auto populates stats
    const insertQuery = `
        INSERT INTO players (gamertag, profilePicture, stats, user_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
    const values = [playerData.gamertag, playerData.profilePicture, JSON.stringify(playerData.stats), playerData.user_id];
    const result = await pool.query(insertQuery, values);
    return result.rows[0];
}

/**
 * DELETE request model for deleting a single player
 * @param {number} id 
 */
exports.deletePlayerById = async (id) => {
    const deleteQuery = 'DELETE FROM players WHERE id = $1 AND user_id = $2';
    await pool.query(deleteQuery, [playerId, userId]);
}

/**
 * GET request model for retrieving a single player
 * @param {number} id 
 * @returns {object}
 */
exports.getSinglePlayer = async (id) => {
    const queryResult = await pool.query('SELECT * FROM players WHERE id = $1 AND user_id = $2', [playerId, userId]);
    return queryResult.rows[0];
}
