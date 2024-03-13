// no need for try...catch block
const asyncHandler = require('express-async-handler');

// sanitize and validate data
const { body, validationResult } = require('express-validator');

// mongoose models
const Game = require('./../models/game');

// debug
const debug = require('debug')('xxxxxxxxxxxxxxxxxxxx-debug-xxxxxxxxxxxxxxxxxxxx');

// mongoose to check valid req.params.postid
const mongoose = require('mongoose');

module.exports.game_get = asyncHandler(async (req, res) => {
  const games = await Game.find({}).exec();

  // manually sort playTime because it's virtual property
  const gamesSorted = games.sort((a, b) => a.playTime - b.playTime);

  res.json({ games: gamesSorted });
});

module.exports.game_post = asyncHandler(async (req, res) => {
  const { startTime, gameId } = req.body;

  debug(`the startTime req belike: `, startTime);
  debug(`the gameId req belike: `, gameId);

  const dateObj = new Date(startTime);

  const game = new Game({ startTime: dateObj, gameId });
  await game.save();

  res.json(game);
});

// hard code positions to check when game_put because we don't want this in every game document TODO change to real position
const POSITIONS = {
  waldo: {
    x: 10,
    y: 10,
  },

  odlaw: {
    x: 10,
    y: 10,
  },

  wizard: {
    x: 10,
    y: 10,
  },
};

module.exports.game_put = [
  body(`username`).trim().escape(),
  asyncHandler(async (req, res) => {
    const { username, charname, position, time, gameId } = req.body;

    const oldGame = await Game.findOne({ gameId }).exec();

    if (oldGame === null) {
      return res.sendStatus(404);
    }

    // finish game and set name
    if (username !== undefined) {
      const newGame = new Game({
        ...oldGame.toJSON(), // keep almost every old properties
        name, // update name
        _id: oldGame._id, // keep id
      });

      await Game.findByIdAndUpdate(oldGame._id, newGame, {});

      return res.sendStatus(200);
    }

    // validate correct positions TODO add some prefix like +-2% (because user hardly place exactly the %position we want)
    const characters = oldGame.characters.filter((char) => {
      // if charname still exists in oldGame and position of charname is correct
      if (char === charname && POSITIONS[charname].x === position.x && POSITIONS[charname].y === position.y) {
        return false; // remove that char
      }

      return true; // keep
    });

    // TODO
  }),
];

module.exports.game_delete = asyncHandler(async (req, res) => {
  try {
    // clear games that don't have endTime
    await Game.deleteMany({ endTime: { $exists: false } });

    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(404);
  }
});
