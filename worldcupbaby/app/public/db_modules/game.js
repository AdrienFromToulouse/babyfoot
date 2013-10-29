(function() {
  var mongoose, player;

  mongoose = require("mongoose");

  player = require("./player");

  exports.createNewGame = function() {
    var Game, Player, newgame;
    Game = mongoose.model("Game");
    Player = mongoose.model("Player");
    newgame = new Game;
    newgame.created_at = new Date().getTime();
    newgame.started_at = new Date().getTime();
    newgame.stopped_at = 0;
    newgame.duration = 0;
    newgame.score_team1 = 0;
    newgame.score_team2 = 0;
    newgame.started = true;
    return newgame.save(function(err) {
      var query;
      if (err) {
        throw err;
      }
      query = Game.find().sort({
        created_at: "desc"
      }).limit(1);
      return query.exec(function(err, game) {
        var game_id;
        if (err) {
          throw err;
        }
        game_id = game[game.length - 1]._id;
        return Player.find({
          ready: true
        }).sort({
          logged_at: "desc"
        }).limit(4).exec(function(err, players) {
          var i;
          if (err) {
            throw err;
          }
          game_id = game_id.toString(16);
          player = void 0;
          i = void 0;
          i = 0;
          while (i < players.length) {
            newgame.players.push(players[i]);
            i++;
          }
          return newgame.save(function(err) {
            if (err) {
              return handleError(err);
            }
          });
        });
      });
    });
  };

  exports.closeCurrentGame = function(req, res) {
    var Game, Player, query;
    Game = mongoose.model("Game");
    Player = mongoose.model("Player");
    query = Game.find().sort({
      created_at: "desc"
    }).limit(1);
    return query.exec(function(err, game) {
      var duration, stopAt;
      if (err) {
        throw err;
      }
      stopAt = new Date().getTime();
      duration = stopAt - game[game.length - 1].started_at;
      return Game.update({
        _id: game[game.length - 1]._id
      }, {
        started: false,
        stopped_at: stopAt,
        duration: duration,
        score_team1: req.body.data.score.score_team1,
        score_team2: req.body.data.score.score_team2
      }, function(err) {
        if (err) {
          throw err;
        }
        return Player.find({
          ready: true
        }).sort({
          logged_at: "desc"
        }).limit(8).exec(function(err, players) {
          var i;
          if (err) {
            throw err;
          }
          player = void 0;
          i = void 0;
          i = 0;
          while (i < players.length) {
            player = players[i];
            player.update({
              ready: false
            }, function(err) {
              if (err) {
                throw err;
              }
            });
            i++;
          }
          return res.send(req.body);
        });
      });
    });
  };

  exports.updateScore = function(req, res) {
    var Game, query;
    Game = mongoose.model("Game");
    query = Game.find().sort({
      created_at: "desc"
    }).limit(1);
    return query.exec(function(err, game) {
      if (err) {
        throw err;
      }
      return Game.update({
        _id: game[game.length - 1]._id
      }, {
        score_team1: req.body.data.score_team1,
        score_team2: req.body.data.score_team2
      }, function(err) {
        if (err) {
          throw err;
        }
        return res.send(req.body);
      });
    });
  };

  exports.getCurrentScoreNPlayer = function(bayeux, channel) {
    var Game, query;
    Game = mongoose.model("Game");
    query = Game.find({
      started: true
    });
    return query.exec(function(err, game) {
      var i, message, msg;
      if (game.length !== 0) {
        switch (channel) {
          case "/index":
            bayeux.getClient().publish("/index", {
              cmd: "upScore",
              score_team1: game[0].score_team1,
              score_team2: game[0].score_team2
            });
            message = [0, 0, 0, 0];
            i = 0;
            while (i < game[0].players.length) {
              msg = {
                first_name: "",
                picture: "",
                position: "",
                access_token: ""
              };
              msg.picture = game[0].players[i].personal.picture;
              msg.first_name = game[0].players[i].personal.first_name;
              msg.position = game[0].players[i].position;
              msg.access_token = game[0].players[i].accessToken;
              message[msg.position - 1] = msg;
              i++;
            }
            return bayeux.getClient().publish("/index", message);
          case "/admin":
            message = [0, 0, 0, 0];
            i = 0;
            while (i < game[0].players.length) {
              console.log("getCurrentScoreNPlayer FOR ADMIN");
              msg = {
                first_name: "",
                picture: "",
                position: "",
                access_token: ""
              };
              msg.picture = game[0].players[i].personal.picture;
              msg.first_name = game[0].players[i].personal.first_name;
              msg.position = game[0].players[i].position;
              msg.access_token = game[0].players[i].accessToken;
              message[msg.position - 1] = msg;
              i++;
            }
            return bayeux.getClient().publish("/admin", message);
          default:
            return console.log("ELSE");
        }
      }
    });
  };

  exports.getAllPlayedGame = function(req, res) {
    var Game, query;
    Game = mongoose.model("Game");
    query = Game.find();
    return query.exec(function(err, games) {
      if (games.length !== 0) {
        return res.json(games);
      }
    });
  };

  exports.resetMeReady = function() {
    var Game, query;
    Game = mongoose.model("Game");
    query = Game.find().sort({
      started_at: "desc"
    }).limit(10);
    return query.exec(function(err, games) {
      var i, _results;
      if (games.length > 0) {
        i = 0;
        _results = [];
        while (i < games.length) {
          games[i].update({
            started: false
          }, function() {
            return console.log("updated game");
          });
          _results.push(i++);
        }
        return _results;
      }
    });
  };

}).call(this);
