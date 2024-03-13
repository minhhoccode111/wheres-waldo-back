// custom script to interact with database
const Game = require('./../src/models/game');

// const debug = require('debug')('custom-debug');
const debug = (...str) => {
  for (const s of str) {
    console.log(s);
  }
};

const mongoDB = process.argv.slice(2)[0] ?? process.env.DEVELOPMENT_DB;

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

main().catch((err) => debug('some errors occur', err));

async function main() {
  debug('about to connect to database');
  await mongoose.connect(mongoDB);
  const gameNum = await Game.countDocuments({}).exec();
  // const games = await Game.find({}).exec();

  // do some custom things

  // do some custom things

  // debug(`games belike: `, games);
  debug(`number of game currently in database: ${gameNum}`);
  debug('connected');
  debug('about to disconnect to database');
  await mongoose.connection.close();
}
