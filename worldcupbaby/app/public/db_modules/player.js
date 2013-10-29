(function() {
  var mongoose;

  mongoose = require("mongoose");

  exports.addPlayer = function(player_logged) {
    var Player, player;
    Player = mongoose.model("Player");
    player = new Player;
    player.personal.name = player_logged.name;
    player.personal.fb_id = player_logged.fb_id;
    player.personal.first_name = player_logged.first_name;
    player.personal.last_name = player_logged.last_name;
    player.personal.name = player_logged.name;
    player.personal.gender = player_logged.gender;
    player.personal.locale = player_logged.locale;
    player.personal.link = player_logged.link;
    player.personal.picture = player_logged.picture;
    player.personal.email = player_logged.email;
    player.logged_at = new Date().getTime();
    player.babyId = player_logged.babyId;
    player.position = player_logged.position;
    player.accessToken = player_logged.accessToken;
    console.log(player_logged.position);
    if ((player_logged.position === "1") || (player_logged.position === "2")) {
      player.team = 1;
    } else {
      player.team = 2;
    }
    player.stats.score = 0;
    return player.save(function(err) {
      if (err) {
        return console.log("ERROR");
      } else {
        return console.log("ADDED");
      }
    });
  };

  exports.getCurrentPlayers = function(bayeux, position, babyId) {
    var Player, message, query;
    message = {
      score: "",
      name: "",
      picture: "",
      position: "",
      babyId: ""
    };
    Player = mongoose.model("Player");
    query = Player.find({
      ready: true
    }).limit(4);
    return query.exec(function(err, players) {
      var i, _results;
      i = 0;
      _results = [];
      while (i < players.length) {
        message.picture = players[i].personal.picture;
        message.name = players[i].personal.first_name;
        message.score = players[i].stats.score;
        message.position = players[i].position;
        message.babyId = players[i].babyId;
        bayeux.getClient().publish("/player/" + position + "/baby/" + babyId, message);
        _results.push(i++);
      }
      return _results;
    });
  };

  exports.getCurrentPlayersForIndex = function(bayeux) {
    var Player, message, query;
    message = [0, 0, 0, 0];
    Player = mongoose.model("Player");
    query = Player.find().sort({
      logged_at: "desc"
    }).limit(4);
    return query.exec(function(err, players) {
      var i, msg;
      i = 0;
      while (i < players.length) {
        msg = {
          first_name: "",
          picture: "",
          position: "",
          access_token: ""
        };
        msg.picture = players[i].personal.picture;
        msg.first_name = players[i].personal.first_name;
        msg.position = players[i].position;
        msg.access_token = players[i].accessToken;
        message[msg.position - 1] = msg;
        i++;
      }
      return bayeux.getClient().publish("/index", message);
    });
  };

  exports.getCurrentPlayersForAdmin = function(bayeux) {
    var Player, message, query;
    message = [0, 0, 0, 0];
    Player = mongoose.model("Player");
    query = Player.find().sort({
      logged_at: "desc"
    }).limit(4);
    return query.exec(function(err, players) {
      var i, msg;
      i = 0;
      while (i < players.length) {
        msg = {
          first_name: "",
          picture: "",
          position: "",
          access_token: ""
        };
        msg.picture = players[i].personal.picture;
        msg.first_name = players[i].personal.first_name;
        msg.position = players[i].position;
        msg.access_token = players[i].accessToken;
        message[msg.position - 1] = msg;
        i++;
      }
      return bayeux.getClient().publish("/admin", message);
    });
  };

  exports.setScores = function(score) {
    var Player, query;
    Player = mongoose.model("Player");
    query = Player.find().sort({
      logged_at: "desc"
    }).limit(4);
    return query.exec(function(err, players) {
      var i, position, _results;
      i = 0;
      _results = [];
      while (i < players.length) {
        position = players[i].position;
        if (score[0][position - 1] < 0) {
          score[0][position - 1] = 0;
        }
        if (score[0][position - 1] > 10) {
          score[0][position - 1] = 10;
        }
        players[i].update({
          ready: false,
          stats: {
            score: score[0][position - 1]
          }
        }, function() {
          return console.log("updated");
        });
        _results.push(i++);
      }
      return _results;
    });
  };

  exports.isPlaying = function(req, res) {
    var Player, query;
    Player = mongoose.model("Player");
    query = Player.findOne({
      ready: true,
      "personal.fb_id": req.params.fbid
    });
    return query.exec(function(err, player) {
      if (player) {
        return res.redirect("/");
      } else {
        return res.render("expired", {
          title: "LiveGameUp!"
        });
      }
    });
  };

  exports.getCurrentPlayersForGame = function(bayeux) {
    var Player, query;
    Player = mongoose.model("Player");
    query = Player.find();
    return query.exec(function(err, players) {
      console.log(players);
      return bayeux.getClient().publish("/games", players);
    });
  };

  exports.setMeReady = function(res, myPosition) {
    var Player, query;
    Player = mongoose.model("Player");
    query = Player.find({
      position: myPosition
    }).sort({
      logged_at: "desc"
    }).limit(8);
    return query.exec(function(err, players) {
      if (players.length > 0) {
        players[0].update({
          ready: true
        }, function() {});
        return res.send(players[0]);
      }
    });
  };

  exports.resetMeReady = function() {
    var Player, query;
    Player = mongoose.model("Player");
    query = Player.find().sort({
      logged_at: "desc"
    }).limit(10);
    return query.exec(function(err, players) {
      var i, _results;
      if (players.length > 0) {
        i = 0;
        _results = [];
        while (i < players.length) {
          players[i].update({
            ready: false
          }, function() {
            return console.log("updated");
          });
          _results.push(i++);
        }
        return _results;
      }
    });
  };

}).call(this);
