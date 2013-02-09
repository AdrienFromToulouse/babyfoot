/**
 * Include
 */
var mongoose = require('mongoose');


/**
 * Defines the player's schema.
 *
 */
var playerSchema = new mongoose.Schema({

    personal:{

	fb_id: String,
 	first_name: String,
	last_name: String,
	name: String,
	gender: String,
	locale: String,
	link: String,
	picture: String,
	email: String
    },

    ready: { type: Boolean, default: true }, //page is already loaded so its true...
    logged_at: Number,
    babyId: Number,
    gameID: String,

    position: Number,
    team: String,

    stats:{
	score: Number,
    }
});

/**
 * Used to export the schema everywhere.
 *
 */
getSchema = function(){
    return playerSchema;
};


/**
 * Gathers all the ready players to send to the new player who is connecting. 
 *
 * param[in]: bayeux - server to handle the websocket messaging.
 * param[in]: position - player position.
 * param[in]: babyId   - babyfoot identifier.
 *
 */
exports.getCurrentPlayers = function(bayeux, position, babyId){

    var message = {
    	"score" :   "",
    	"name" :  "",
	"picture": "",
	"position": "",
	"babyId": ""
    };

    db = mongoose.createConnection('localhost', 'asiance_babyfoot');

    var Player = db.model('Player', playerSchema);
    var player = new Player;
    
    db.once('open', function () {

	var query = Player.find({ ready: true }).limit(4);
    	query.exec(function (err, players) {

	    for(i = 0 ; i < players.length ; i++){

		message.picture = players[i].personal.picture;
		message.name = players[i].personal.first_name;
		message.score = players[i].stats.score;
		message.position = players[i].position;
		message.babyId = players[i].babyId;

		bayeux.getClient().publish('/player/'+position+'/baby/'+babyId, message);
    	    }
	    mongoose.disconnect();
	});
    });
};

/**
 * Gathers all the ready players to send to the index on index connect. 
 *
 * param[in]: bayeux - server to handle the websocket messaging.
 * param[in]: theScore - the score array.
 *
 */
exports.getCurrentPlayersForIndex = function(bayeux, theScore){

    var message = [0,0,0,0];

    db = mongoose.createConnection('localhost', 'asiance_babyfoot');

    var Player = db.model('Player', playerSchema);
    var player = new Player;
    
    db.once('open', function () {

	var query = Player.find({ ready: true }).limit(4);
    	query.exec(function (err, players) {

	    for(i = 0 ; i < players.length ; i++){

		var msg = {
    		    "score" :   "",
    		    "name" :  "",
		    "picture": "",
		    "position": "",
		    "babyId": ""
		};

		msg.picture = '<img src="'+players[i].personal.picture+'">';
		msg.name = players[i].personal.first_name;
		//msg.score = players[i].stats.score;
 		msg.position = players[i].position;
		msg.babyId = players[i].babyId;
		msg.score = theScore[msg.babyId - 1][msg.position - 1];

		message[msg.position - 1] = msg;
    	    }
	    mongoose.disconnect();
	    bayeux.getClient().publish('/index', message);
	});
    });
};

/**
 * Add player to the DB.
 *
 * param[in]: player_logged - the player who is logging.
 *
 */
exports.addPlayer = function(player_logged){

    db = mongoose.createConnection('localhost', 'asiance_babyfoot');

    var Player = db.model('Player', playerSchema);
   
    var player = new Player;

    db.once('open', function (err, db) {
 
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

	if( (player_logged.position == 1) || (player_logged.position == 2) ){
	    player.team = 1;
	}
	else{
	    player.team = 2;
	}
	player.stats.score = 0;

	player.save(function (err) {
    	    if(err){
		mongoose.disconnect();
    	    }else{
		mongoose.disconnect();}
	});
    });
};

/**
 * After login it retrieves all the data corresponding to the current player (me)
 *
 * param[in]: req - request.
 * param[in]: res - response.
 *
 */
exports.getAplayer = function(req, res){

    db = mongoose.createConnection('localhost', 'asiance_babyfoot');

    var Player = db.model('Player', playerSchema);
    
    db.once('open', function () {

	var query = Player.findOne({position: req.body.position, 
				    ready: true, 
				    babyId: req.body.babyId, 
				   });

    	query.exec(function (err, player) {
	    
	    mongoose.disconnect();

	    // res.header("Access-Control-Allow-Origin", "*"); 
	    // res.header("Access-Control-Allow-Headers", "X-Requested-With");
	    res.send(player);
	});
    });
}

	
/**
 * To switch from ready to notready when the player unsubscripts.
 * 
 * param[in]: babyId   - babyfoot identifier.
 * param[in]: position - player position.
 * param[in]: score    - player score.
 *    
 */
exports.unsubscriptPlayer = function(babyId,
				     position, 
				     score){

    db = mongoose.createConnection('localhost', 'asiance_babyfoot');

    var Player = db.model('Player', playerSchema);

    db.once('open', function () {

	Player.update({position: position, babyId: babyId, ready: true},{"ready": false, stats: {score: score}},
		      function(){mongoose.disconnect();});
    });
};