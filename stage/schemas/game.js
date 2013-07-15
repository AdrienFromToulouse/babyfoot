/**
 * Include
 */
var mongoose = require('mongoose');
var player = require('./player');


/**
 * Define the game's schema
 */
var gameSchema = new mongoose.Schema({

    started: {type: Boolean, default: false },
    created_at: Number,
    started_at: Number,
    stopped_at: Number,
    duration: Number,
    score_team1: Number,
    score_team2: Number,
});

/**
 * On start, get the new game ID and set it to each current players.
 *
 */
exports.createNewGame = function () {

  db = mongoose.createConnection('localhost', 'asiance_babyfoot');
  var Game = db.model('Game', gameSchema);
  var newgame = new Game;

  // var playerSchema = player.create_Schema();
  var Player = db.model('Player', player.playerSchema);

  db.once('open', function (err, db) {

    newgame.created_at = new Date().getTime();
    newgame.started_at = new Date().getTime();
    newgame.stopped_at = 0;
    newgame.duration = 0;
    newgame.score_team1 = 0;
    newgame.score_team2 = 0;
    newgame.started = true;

    newgame.save(function (err) {
      if (err) {
        throw err;
      }
      var query = Game.find().sort({ created_at: 'desc'}).limit(1);

      query.exec(function (err, game) {
        if (err) {
          throw err;
        }
        /* get the last game ID created */
        game_id = game[game.length - 1]._id;

          Player.find({"ready": true}).sort({ logged_at: 'desc'}).limit(4).exec(function (err, players) {
          if (err) {
            throw err;
          }
          game_id = game_id.toString(16);

          var player;
          var i;
          for (i = 0; i < players.length; i++) {
            player = players[i];
            player.update({ gameID: game_id}, function (err) {
              if (err) {
                throw err;
              }
            });
          }
          mongoose.disconnect();
        });
      });
    });
  });
};


/**
 * Set the stop date of a game
 *
 */
exports.closeCurrentGame = function (req, res) {

    db = mongoose.createConnection('localhost', 'asiance_babyfoot');
    var Game = db.model('Game', gameSchema);

    var Player = db.model('Player', player.playerSchema);

    db.once('open', function (db, err) {

	var query = Game.find().sort({ created_at: 'desc'}).limit(1);
	query.exec(function (err, game) {
	    if (err) {
		throw err;
	    }
	    var stopAt = new Date().getTime();
	    var duration = stopAt - game[game.length - 1].started_at;

	    Game.update({ _id: game[game.length - 1]._id}, { started: false, stopped_at: stopAt, duration: duration , score_team1: req.body.data.score.score_team1, score_team2: req.body.data.score.score_team2}, function (err) {
		if (err) {
		    throw err;
		}

		Player.find({"ready": true}).sort({ logged_at: 'desc'}).limit(4).exec(function (err, players) {
		    if (err) {
			throw err;
		    }
		  
		    var player;
		    var i;
		    for (i = 0; i < players.length; i++) {
			player = players[i];
			player.update({ ready: false}, function (err) {
			    if (err) {
				throw err;
			    }
			});
		    }
		    mongoose.disconnect();
                    res.send(req.body);
		});

	    });
	});
    });
};


/**
 * Update the main score of a game: DOESN'T WORK REALY GOOD....
 *
 */
exports.updateScore = function (req, res) {

    db = mongoose.createConnection('localhost', 'asiance_babyfoot');
    var Game = db.model('Game', gameSchema);
    
    db.once('open', function () {

	var query = Game.find().sort({ created_at: 'desc'}).limit(1);
	query.exec(function (err, game) {
	    if (err) {throw err;}
	    Game.update({ _id: game[game.length - 1]._id},
			{ score_team1: req.body.data.score_team1, score_team2: req.body.data.score_team2 }, function (err) {
			    if (err) {throw err;}
			    res.send(req.body);
			    mongoose.disconnect();
			});
	});
    });
};


/**
 *
 */
exports.getCurrentScoreNPlayer = function (bayeux) {

  db = mongoose.createConnection('localhost', 'asiance_babyfoot');
  var Game = db.model('Game', gameSchema);

    db.once('open', function (err, db) {

        var query = Game.find({started: true});
	query.exec(function (err, game) {

	    if(game.length != 0){
		bayeux.getClient().publish('/index', {cmd: "upScore", score_team1: game[0].score_team1, score_team2: game[0].score_team2});
		// Because of the asynchronism it has to be here and not in app.js 
		// otherwise score is never transmitted
		player.getCurrentPlayersForIndex(bayeux);
		mongoose.disconnect();
	    }

	});
    });
};
