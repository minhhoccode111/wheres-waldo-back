// add default data in database
require('dotenv').config(); // this line cause me 30 mins to deBUG

const Game = require('./../src/models/game');

// const custom = require('debug')('debug-custom');
const custom = (...str) => {
  for (const s of str) {
    console.log(s);
  }
};

const mongoDB = process.argv.slice(2)[0] ?? process.env.DEVELOPMENT_DB;

custom(mongoDB);

const games = [];

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const gameCreate = async (index, startTime, firstFound, secondFound, endTime, name, gameId) => {
  const gameDetail = {
    startTime,
    firstFound,
    secondFound,
    endTime,
    name,
    gameId,
  };
  const game = new Game(gameDetail);
  await game.save();
  games[index] = game;
  custom(`adding ${startTime} with id: ${game._id}`);
};

main().catch((err) => custom(err));

async function main() {
  custom('about to connect to database');
  await mongoose.connect(mongoDB);
  custom('about to insert some documents');
  await createGames();
  custom('finishes insert documents');
  await mongoose.connection.close();
  custom('connection closed');
}

async function createGames() {
  // await gameCreate(index, startTime, firstFound, secondFound, endTime, name, gameId )

  let first = Math.floor(Math.random() * 10000);
  let second = Math.floor(Math.random() * 10000) + first;
  let third = Math.floor(Math.random() * 10000) + second;
  let now = new Date(Date.now()),
    firstFound = new Date(Date.now() + first),
    secondFound = new Date(Date.now() + second),
    endTime = new Date(Date.now() + third);
  await gameCreate(0, now, firstFound, secondFound, endTime, 'name0', 'gameid0');

  first = Math.floor(Math.random() * 10000);
  second = Math.floor(Math.random() * 10000) + first;
  third = Math.floor(Math.random() * 10000) + second;
  (now = new Date(Date.now())), (firstFound = new Date(Date.now() + first)), (secondFound = new Date(Date.now() + second)), (endTime = new Date(Date.now() + third));
  await gameCreate(1, now, firstFound, secondFound, endTime, 'name1', 'gameid1');

  first = Math.floor(Math.random() * 10000);
  second = Math.floor(Math.random() * 10000) + first;
  third = Math.floor(Math.random() * 10000) + second;
  (now = new Date(Date.now())), (firstFound = new Date(Date.now() + first)), (secondFound = new Date(Date.now() + second)), (endTime = new Date(Date.now() + third));
  await gameCreate(2, now, firstFound, secondFound, endTime, 'name2', 'gameid2');

  first = Math.floor(Math.random() * 10000);
  second = Math.floor(Math.random() * 10000) + first;
  third = Math.floor(Math.random() * 10000) + second;
  (now = new Date(Date.now())), (firstFound = new Date(Date.now() + first)), (secondFound = new Date(Date.now() + second)), (endTime = new Date(Date.now() + third));
  await gameCreate(3, now, firstFound, secondFound, endTime, 'name3', 'gameid3');

  first = Math.floor(Math.random() * 10000);
  second = Math.floor(Math.random() * 10000) + first;
  third = Math.floor(Math.random() * 10000) + second;
  (now = new Date(Date.now())), (firstFound = new Date(Date.now() + first)), (secondFound = new Date(Date.now() + second)), (endTime = new Date(Date.now() + third));
  await gameCreate(4, now, firstFound, secondFound, endTime, 'name4', 'gameid4');

  const count = await Game.countDocuments({}).exec();
  custom(`Game models is having: ${count} documents`);
}
