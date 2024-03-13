const express = require('express');
const router = express.Router();

const IndexController = require('../controllers/indexController');

// get all games have been played
router.get('/game', IndexController.game_get);

// create a new game
router.post('/game', IndexController.game_post);

// edit a game, like user's name or time found characters
router.put('/game', IndexController.game_put);

// clean up empty games
router.delete('/game', IndexController.game_delete);

module.exports = router;
