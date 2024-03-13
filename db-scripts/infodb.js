// get database info
const Game = require('./../src/models/game');

// to get database URI
require('dotenv').config(); // this line cause me 30 mins to deBUG

// const debug = require('debug')('custom-debug');
const debug = (...str) => {
  for (const s of str) {
    console.log(s);
  }
};

const mongoDB = process.argv.slice(2)[0] ?? process.env.MONGODB_URI_DEVELOPMENT;

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

main().catch((err) => debug('some errors occur', err));

async function main() {
  debug('about to connect to database');
  await mongoose.connect(mongoDB);
  const gameNum = await Game.countDocuments({}).exec();
  const games = await Game.find({}).exec();

  debug(`games belike: `, games);
  debug(`number of game currently in database: ${gameNum}`);
  debug('connected');
  debug('about to disconnect to database');
  await mongoose.connection.close();
}
