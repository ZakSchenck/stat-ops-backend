const express = require('express');
const router = express.Router();
const playerController = require('../controllers/players');
const apiLink = '/api/v1/players'

// GET action for getting all player data
router.get(`${apiLink}/all`, playerController.getAllPlayers);
// GET action for getting a single player's data
router.get(`${apiLink}/:id`, playerController.getSinglePlayer);

// POST action for creating a new player - auto populates stats
router.post(`${apiLink}`, playerController.createNewPlayer);

// DELETE action for deleting a single player
router.post(`${apiLink}/:id`)


module.exports = router;