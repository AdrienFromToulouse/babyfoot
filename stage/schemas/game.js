var P1_ATTACKER = 0;
var P2_ATTACKER = 1;
var P3_ATTACKER = 2;
var P4_ATTACKER = 3; 

var P1_DEFENSER = 4;
var P2_DEFENSER = 5;
var P3_DEFENSER = 6;
var P4_DEFENSER = 7; 

/**
 * Include
 */
var mongoose = require('mongoose');
var player = require('./player');


var game_ctxt = {
    "score_team1": "",
    "score_team2": ""
};


/**
 * Define the schema
 */
function createSchema(){

    var gameSchema = new mongoose.Schema({

	created_at: Number,
	started_at: Number,
	stopped_at: Number,
	duration: Number,
	score_team1: Number,
	score_team2: Number,
	broadOnChan: Number,
//	_players : [{ type: Schema.Types.ObjectId, ref: 'player' }]
    });
    return gameSchema;
};


/**
 * On start, get the new game ID and set it to each current players.
 *
 */
exports.createNewGame = function(){
    
    console.log("CREATE GAME");

    var gameSchema = createSchema();

    db = mongoose.createConnection('localhost', 'asiance_babyfoot');

    var Game = db.model('Game', gameSchema);
   
    var newgame = new Game;


    var playerSchema = player.create_Schema();
    var Player = db.model('Player', playerSchema);

    db.once('open', function (err, db) {

	newgame.created_at = new Date().getTime();
	newgame.started_at = new Date().getTime();
	newgame.stopped_at = 0;
	newgame.duration =   0;
	newgame.score_team1 = 0;
	newgame.score_team2 = 0;
	newgame.broadOnChan = 1;

	newgame.save(function (err) {
    	    if(err){throw err;}

	    var query = Game.find().sort({ created_at: 'desc'}).limit(1);

	    query.exec(function (err, game) {
	    	if (err) { throw err; }


	    	/* get the last game ID created to retrieve data related to it */
	    	game_id=game[game.length-1]._id;

    	
	    	//TODO replace the magic number by NBROF_PLAYERS
   	    	Player.find().sort({ logged_at: 'desc'}).limit(4).exec(function (err, players) {

	    	    if (err) { throw err; }

	    	    console.log(game_id);

	    	    game_id = game_id.toString(16);

	    	        var player;
	    	        var i;
	    	        for (i = 0 ; i < players.length ; i++) {
	    	    	player = players[i];
	    	   
	    	    	/* find si logged y a moins de 10 mins ou depend du nbrof player ???*/	
	    	            player.update({ gameID : game_id},function (err) {
	    	    	    if (err) { throw err; }
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
exports.closeCurrentGame = function(){
    
    var gameSchema = createSchema();

    db = mongoose.createConnection('localhost', 'asiance_babyfoot');

    var Game = db.model('Game', gameSchema);

 
    db.once('open', function (db,err) {

	var query = Game.find().sort({ created_at: 'desc'}).limit(1);

	query.exec(function (err, game) {
	    if (err) { throw err; }

	    /* get the last game ID created to retrieve data related to it */

	    var stopAt = new Date().getTime();
	    var duration =  stopAt - game[game.length-1].started_at;

	    //update stopped_at
	    Game.update({ _id : game[game.length-1]._id}, { stopped_at : stopAt, duration: duration },function (err) {
		if (err) { throw err; }
		mongoose.disconnect();
	    });
	});
    });
};


/**
 * Update the main score of a game: DOESN'T WORK REALY GOOD.... 
 *
 */
exports.updateScore = function(message){

    var gameSchema = createSchema();

    db = mongoose.createConnection('localhost', 'asiance_babyfoot');

    var Game = db.model('Game', gameSchema);


    score_team1 = message.score[P1_ATTACKER] + message.score[P1_DEFENSER] + message.score[P2_ATTACKER] + message.score[P2_DEFENSER];
    score_team2 = message.score[P3_ATTACKER] + message.score[P3_DEFENSER] + message.score[P4_ATTACKER] + message.score[P4_DEFENSER];
   
    db.once('open', function () {

	var query = Game.find().sort({ created_at: 'desc'}).limit(1);

	query.exec(function (err, game) {
	    if (err) { throw err; }

	    /* get the last game ID created to retrieve data related to it */

	    console.log("GAME UPDATE !!!");

	    console.log(game[game.length-1]._id);

	    Game.update({ _id : game[game.length-1]._id}, 
			{ score_team1: score_team1 , score_team2: score_team2 },function (err) {
			    if (err) { throw err; }
			    mongoose.disconnect();
			});
	});
    });
};