const Player = require('../models/players');

// GET request for getting all players
exports.getAllPlayers = async (req, res) => {
    try {
        const userId = req.user.id;
        const players = await Player.getAllPlayers(userId);
        res.json(players);
    } catch (error) {
        console.error(error.message);
        res.status(500).send(`500 Server Error on 'getAllPlayers': ${error.message}`);
    }
}

// GET request for selecting a single player
exports.getSinglePlayer = async (req, res) => {
    try {
        const userId = req.user.id;
        const playerId = req.params.id;
        const result = await Player.getSinglePlayer(playerId, userId);

        if (!result) {
            res.status(404).send(`Player not found with the ID of ${playerId}`);
        } else {
            res.json(result);
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send(`500 server error on 'getSinglePlayer': ${error.message}`);
    }
};

// POST request for creating new player
exports.createNewPlayer = async (req, res) => {
    try {
        // ID of the logged-in user
        const userId = req.user.id;
        const { gamertag, profilePicture } = req.body;
        // Default player stats structure
        const defaultStats = {
            hardpoint: {
                gameMode: "Hardpoint",
                totalKills: 0,
                totalDeaths: 0,
                killsPerMatch: 0,
                wins: 0,
                losses: 0,
                winPercentage: 0,
                avgHillTime: 0,
                matches: []
            },
            snd: {
                gameMode: "SnD",
                totalKills: 0,
                totalDeaths: 0,
                killsPerMatch: 0,
                wins: 0,
                losses: 0,
                winPercentage: 0,
                plants: 0,
                defuses: 0,
                matches: []
            }
        };
        const playerData = {
            gamertag,
            profilePicture,
            stats: defaultStats,
            user_id: userId
        };

        const newPlayer = await Player.createNewPlayer(playerData);
        res.status(201).json(newPlayer);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error while creating player');
    }
}

// DELETE request for deleting player 
exports.deletePlayer = async (req, res) => {
    try {
        const userId = req.user.id;
        const playerId = req.params.id;
        await Player.deletePlayerById(playerId, userId);
        res.status(200).send(`Player with ID ${playerId} was successfully deleted.`);
    } catch (error) {
        console.error(error.message);
        res.status(500).send(`500 Server Error on 'deletePlayer': ${error.message}`);
    }
}