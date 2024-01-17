const express = require('express');
const router = express.Router();
const playerController = require('../controllers/players');

// GET action for getting all player data
router.get(`/all`, playerController.getAllPlayers);
// GET action for getting a single player's data
router.get(`/:id`, playerController.getSinglePlayer);

// POST action for creating a new player - auto populates stats
router.post(`/`, playerController.createNewPlayer);

// DELETE action for deleting a single player
router.post(`/:id`)

router.delete(`/:id`)


module.exports = router;