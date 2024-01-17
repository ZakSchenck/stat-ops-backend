const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matches');

router.get(`/hardpoint/all`, matchController.getAllHardpointMatches);
router.get(`/snd/all`, matchController.getAllSndMatches);

router.post(`/hardpoint/:id`, matchController.addHardpointMatch);
router.post(`/snd/:id`, matchController.addSndMatch);

router.delete(`/hardpoint/:id/:playerId`, matchController.deleteHardpointMatch);
router.delete(`/snd/:id/:playerId`, matchController.deleteSndMatch);

module.exports = router