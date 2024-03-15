// no need for try...catch block
const asyncHandler = require('express-async-handler');

// sanitize and validate data
const { body } = require('express-validator');

// mongoose models
const Game = require('./../models/game');

// debug
const debug = require('debug')('xxxxxxxxxxxxxxxxxxxx-debug-xxxxxxxxxxxxxxxxxxxx');

module.exports.game_get = asyncHandler(async (req, res) => {
  const games = await Game.find({}).exec();

  // manually sort playTime because it's virtual property
  const gamesSorted = games.sort((a, b) => a.playTime - b.playTime);

  debug(`get all game belike: `, gamesSorted);

  res.status(200).json({ games: gamesSorted });
});

module.exports.game_post = asyncHandler(async (req, res) => {
  const { startTime, gameId } = req.body;

  debug(`the startTime req belike: `, startTime);
  debug(`the gameId req belike: `, gameId);

  // frontend send epoch so manually make it js date object
  const dateObj = new Date(startTime);
  debug(`the dateObj belike: `, dateObj);

  const game = new Game({ startTime: dateObj, gameId });

  debug(`the game created belike: `, game);
  await game.save();

  res.json(game);
});

// hard coded positions to check when game_put because we don't want this in every Game document, which can cause headache if something change and we have to keep things in sync
const POSITIONS = {
  waldo: {
    x: 61,
    y: 38,
  },

  odlaw: {
    x: 10,
    y: 36,
  },

  wizard: {
    x: 26,
    y: 36,
  },
};

module.exports.game_put = [
  body(`username`).trim().escape(),
  asyncHandler(async (req, res) => {
    const { username, charname, position, time, gameId } = req.body;

    const oldGame = await Game.findOne({ gameId }).exec();

    debug(`the body belike: `, req.body);

    // this condition means game ended and user send their name to store score
    if (username) {
      const newGame = new Game({
        ...oldGame.toJSON(), // keep
        _id: oldGame._id, // keep id, maybe don't need this
        name: username ? username : 'Unknown', // update
      });

      await Game.findByIdAndUpdate(oldGame._id, newGame, {});

      debug(`new update game belike: `, newGame);

      // no extra info, redirect user to /score any way
      return res.sendStatus(200);
    }

    // charname exists in oldGame.characters
    // sth like ['waldo', 'wizard', 'odlaw']
    // and position not undefined
    if (oldGame.characters.indexOf(charname) > -1 && position) {
      const diffX = POSITIONS[charname].x - position.x;
      const diffY = POSITIONS[charname].y - position.y;
      // position match hard coded POSITIONS (~+-1% difference)
      if (diffX > -2 && diffX < 2 && diffY > -2 && diffY < 2) {
        // remove charname from oldGame.characters
        const newGameCharacters = oldGame.characters.filter((c) => c !== charname);

        // manually created js date object with time sent from client
        const timeDateObj = new Date(time);

        // create new game to update from old game
        const newGame = new Game({
          ...oldGame.toJSON(),
          characters: newGameCharacters, // update characters array
          _id: oldGame._id, // keep id, maybe don't need this
        });

        debug(`the time in req.body.time belike: `, time);
        debug(`the timeDateOb belike: `, timeDateObj);
        debug(`the newGameCharacters belike: `, newGameCharacters);

        // update new game's found time base on characters left
        // game end
        if (newGameCharacters.length === 0) {
          newGame.endTime = timeDateObj;
        }
        // first found
        else if (newGameCharacters.length === 2) {
          newGame.firstFound = timeDateObj;
        }
        // second found
        else if (newGameCharacters.length === 1) {
          newGame.secondFound = timeDateObj;
        }

        await Game.findByIdAndUpdate(oldGame._id, newGame, {});

        debug(`new update game belike: `, newGame);

        // send back to client so they can display
        return res.status(200).send({ charname, time });
      }
    }

    // every other cases receive 400
    return res.sendStatus(400);
  }),
];

module.exports.game_delete = asyncHandler(async (req, res) => {
  try {
    // clear games that don't have endTime
    await Game.deleteMany({ endTime: { $exists: false } });

    // send back to client to display
    const games = await Game.find({}).exec();

    debug(`clear empty games`);

    res.status(200).send({ games });
  } catch (err) {
    // not found
    res.sendStatus(404);
  }
});
