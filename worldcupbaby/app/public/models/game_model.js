(function() {
  var Game, gameSchema, mongoose, player;

  mongoose = require("mongoose");

  player = require("./player_model");

  gameSchema = new mongoose.Schema({
    started: {
      type: Boolean,
      "default": false
    },
    created_at: Number,
    started_at: Number,
    stopped_at: Number,
    duration: Number,
    score_team1: Number,
    score_team2: Number,
    players: [player.PlayerSchema]
  });

  Game = module.exports = mongoose.model('Game', gameSchema);

}).call(this);
