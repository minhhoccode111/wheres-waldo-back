// clear database
const Game = require('./../src/models/game');

// to get database URI
require('dotenv').config(); // this line cause me 30 mins to deBUG

// const debug = require('debug')('custom');
const debug = (...str) => {
  for (const s of str) {
    console.log(s);
  }
};

const mongoDB = process.argv.slice(2)[0] ?? process.env.DEVELOPMENT_DB;

debug(mongoDB);

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

main().catch((err) => debug(err));

async function main() {
  debug('about to connect to database');
  await mongoose.connect(mongoDB);
  debug('about to clear database');
  await clearGame();
  debug('database cleared');
  debug('about to close connection');
  await mongoose.connection.close();
  debug('connection closed');
}

async function clearGame() {
  await Game.deleteMany({}).exec();
  const count = await Comment.countDocuments({}).exec();
  debug(`Game models is having: ${count} documents`);
  debug('Game cleared!');
}
