const RateLimit = require('express-rate-limit');
const createError = require('http-errors');
const compression = require('compression');
const express = require('express');
const logger = require('morgan');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const debug = require('debug')('xxxxxxxxxxxxxxxxxxxx-debug-xxxxxxxxxxxxxxxxxxxx');

// connect database
const mongoose = require('mongoose');
// not throw an error when we try to query the property that not explicitly defined on Schema
mongoose.set('strictQuery', false);
// development database string

// if production db is not defined then use the development
const mongoDB = process.env.MONGODB_URI_PRODUCTION ||process.env.MONGODB_URI_DEVELOPMENT  ;

main()
  .then(() => debug('connected to database'))
  .catch((err) => debug('an error occur: ', err));

async function main() {
  await mongoose.connect(mongoDB);
}

const app = express();

// reduce fingerprinting
app.disable('x-powered-by');

// rate limit // TODO change to 20 in production
const limiter = RateLimit({ windowMs: 1 * 60 * 1000, max: 60 }); // max 20/min
app.use(limiter);

// compress responses for performance
app.use(compression());

// security HTTP header
app.use(helmet());

// setup CORS (Cross-origin Resources Sharing) to allow request from any origin
const cors = require('cors');
// app.use(cors()); // TODO is used for development
app.use(
  cors({
    origin: [
      'http://localhost:5173', // development frontend
      'http://localhost:3000', // development postman
      'https://whereswaldotop.vercel.app', // production
    ],
    methods: 'GET,POST,PUT,DELETE', // simple CRUD actions
  })
);

// basic setup
app.use(logger('dev')); // logger
app.use(express.json()); // parse json to js object
app.use(express.urlencoded({ extended: false })); //  parse form data
app.use(express.static(path.join(__dirname, 'public'))); // server things in public

// handle api request
const indexRouter = require('./src/routes/index'); // modular
// this project only have 1 single route handler
app.use('/api/v1/', indexRouter );

// if no route handle the request mean it a 404
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  // we can only access the err object in res.locals.error if development, else it's an empty object
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // log the error
  debug(`the error object: `, err);

  // send the error json to client
  res.status(err.status || 500).json({ message: err.message });
});

module.exports = app;
