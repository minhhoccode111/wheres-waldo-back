const mongoose = require('mongoose');

const { formatDate } = require('./../methods');

const Schema = mongoose.Schema;

const GameSchema = new Schema(
  {
    name: {
      type: String,
      default: 'Unknown',
    },

    startTime: {
      type: Date,
      required: true,
    },

    firstFound: {
      type: Date,
    },

    secondFound: {
      type: Date,
    },

    endTime: {
      type: Date,
    },

    gameId: {
      type: String,
      required: true,
    },

    characters: {
      type: Array,
      default: ['waldo', 'wizard', 'odlaw'],
    },
  },
  { toJSON: { virtuals: true } }
);

GameSchema.virtual('startTimeFormatted').get(function () {
  return formatDate(this.startTime);
});

GameSchema.virtual('startTimeUnix').get(function () {
  return this.startTime.getTime();
});

module.exports = mongoose.model('Game', GameSchema);
