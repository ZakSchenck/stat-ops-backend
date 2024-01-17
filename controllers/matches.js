const Match = require('../models/matches');

// GET request for getting all hardpoint matches
exports.getAllHardpointMatches = async (req, res) => {
    try {
        const hpMatches = await Match.getAllHardpointMatches();
        res.json(hpMatches);
    } catch (error) {
        console.error(error.message);
        res.status(500).send(`500 Server Error on 'getAllHardpointMatches': ${error.message}`);
    }
}

// GET request for getting all SnD matches
exports.getAllSndMatches = async (req, res) => {
    try {
        const sndMatches = await Match.getAllSndMatches();
        res.json(sndMatches);
    } catch (error) {
        console.error(error.message);
        res.status(500).send(`500 Server Error on 'getAllSndMatches': ${error.message}`);
    }
}

 // POST request for creating a new Hardpoint match in player profile
exports.addHardpointMatch = async (req, res) => {
    try {
        const playerId = req.params.id; 
        const matchData = req.body;

        const updatedStats = await Match.addHardpointMatch(playerId, matchData);
        res.status(200).json(updatedStats);
    } catch (error) {
        console.error(error.message);
        res.status(500).send(`Server error: ${error.message}`);
    }
}

// POST request for creating a new SnD match in player profile
exports.addSndMatch = async (req, res) => {
    try {
        const playerId = req.params.id; 
        const matchData = req.body;

        const updatedStats = await Match.addSndMatch(playerId, matchData);
        res.status(200).json(updatedStats);
    } catch (error) {
        console.error(error.message);
        res.status(500).send(`Server error: ${error.message}`);
    }
}

/**
 * DELETE request for a single hardpoint match
 * @param {number} matchId 
 */
exports.deleteHardpointMatch = async (req, res) => {
    try {
        const id = req.params.id;
        const playerId = req.params.playerId;
        const affectedRows = await Match.deleteHardpointMatch(id, playerId);

        if (affectedRows > 0) {
            res.status(200).send(`Match with ID ${id} was successfully deleted.`);
        } else {
            res.status(404).send(`Match with ID ${id} not found.`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send(`500 Server Error on 'deleteHardpointMatch': ${error.message}`);
    }
}

/**
 * DELETE request for a single SnD match
 * @param {number} matchId 
 */
exports.deleteSndMatch = async (req, res) => {
    try {
        const id = req.params.id;
        const playerId = req.params.playerId;
        const affectedRows = await Match.deleteSndMatch(id, playerId);

        if (affectedRows > 0) {
            res.status(200).send(`Match with ID ${id} was successfully deleted.`);
        } else {
            res.status(404).send(`Match with ID ${id} not found.`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send(`500 Server Error on 'deleteSndMatch': ${error.message}`);
    }
}