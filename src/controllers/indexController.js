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

(module.exports.game_get = asyncHandler(async (req, res) => {
  //
  res.send(`get game not implemented`);
})),
  (module.exports.game_post = [
    body(`username`).trim().escape(),
    asyncHandler(async (req, res) => {
      //
      res.send(`post game not implemented`);
    }),
  ]);

module.exports.game_put = [
  body(`username`).trim().escape(),
  asyncHandler(async (req, res) => {
    //
    res.send(`put game not implemented`);
  }),
];

module.exports.game_delete = asyncHandler(async (req, res) => {
  //
  res.send(`delete game not implemented`);
});
