/**
 * Include
 */
var mongoose = require('mongoose');

var PLYR_NBROF_PLAYER = 4;

var P1_ATTACKER = 0;
var P2_ATTACKER = 1;
var P3_ATTACKER = 2;
var P4_ATTACKER = 3; 

var P1_DEFENSER = 4;
var P2_DEFENSER = 5;
var P3_DEFENSER = 6;
var P4_DEFENSER = 7; 



/**
 * Defines the schema of a player.
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

    ready: { type: Boolean, default: true },//page is already loaded so its true...
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
 * Used in tests.
 *
 */
getSchema = function(){
    return playerSchema;
};





/**
 * When a new Index page client connect...
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

    console.log("GET CURRENT PLAYERS");

	var query = Player.find({ ready: true }).limit(4);
    	query.exec(function (err, players) {

		console.log("LENGTH "+players.length);

	    for(i = 0 ; i < players.length ; i++){

//    		if(players[i]){

		message.picture = players[i].personal.picture;
		message.name = players[i].personal.name;
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
 * 
 */
exports.updateScore = function(message){
    
    var playerSchema = createSchema();

    console.log("update score player");

    db = mongoose.createConnection('localhost', 'asiance_babyfoot');

    var Player = db.model('Player', playerSchema);

    var player = new Player;


    db.once('open', function () {

	var query = Player.find().sort({ logged_at: 'desc'}).limit(4);
    	query.exec(function (err, players) {
    	    if (err) { console.log(err); }

	    for(i = 0 ; i < PLYR_NBROF_PLAYER ; i++){
		switch(players[i].position)
		{
		case 1:
		    players[i].update({ 
			stats: { "cendriers": 0, 
	    			 "reprises": 0, 
	    			 "pissettes": 0, 
	    			 "gamelles": 0, 
				 "score_attack":  message.score[P1_ATTACKER],
				 "score_defense": message.score[P1_DEFENSER]}},
	    						  function (err) {
	    						      if (err) { throw err; }
	    						  });
		    break;
		case 2:
		    players[i].update({ 
			stats: { "cendriers": 0, 
	    			 "reprises": 0, 
	    			 "pissettes": 0, 
	    			 "gamelles": 0, 
				 "score_attack":  message.score[P2_ATTACKER],
				 "score_defense": message.score[P2_DEFENSER]}},
	    						  function (err) {
	    						      if (err) { throw err; }
	    						  });
		    break;
		case 3:
		    players[i].update({ 
			stats: { "cendriers": 0, 
	    			 "reprises": 0, 
	    			 "pissettes": 0, 
	    			 "gamelles": 0, 
				 "score_attack":  message.score[P3_ATTACKER],
				 "score_defense": message.score[P3_DEFENSER]}},
	    						  function (err) {
	    						      if (err) { throw err; }
	    						  });
		    break;
		case 4:
		    players[i].update({ 
			stats: { "cendriers": 0, 
	    			 "reprises": 0, 
	    			 "pissettes": 0, 
	    			 "gamelles": 0, 
				 "score_attack":  message.score[P4_ATTACKER],
				 "score_defense": message.score[P4_DEFENSER]}},
	    						  function (err) {
	    						      if (err) { throw err; }
	    						  });
		    break;
		default:
		    break;
		}
	    }
	    mongoose.disconnect();
    	});
    });
};




/**
 * Add player to the DB.
 */
exports.addPlayer = function(player_logged){
    /*
     * Connect and write DB
     */
    db = mongoose.createConnection('localhost', 'asiance_babyfoot');

    /* 
     * Declare new player
     */
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
    		console.log('ERROR');
		mongoose.disconnect();
    	    }else{
		console.log("[INFO] player logged saved");
		mongoose.disconnect();}
	});
    });
};




/**
 * After login it retrieves all the data corresponding to the current player (me)
 *
 */
exports.getAplayer = function(req, res){

    db = mongoose.createConnection('localhost', 'asiance_babyfoot');

    // var Player = new PlayerModel;
    var Player = db.model('Player', playerSchema);
    
    db.once('open', function () {

	var query = Player.findOne({position: req.body.position, 
				    ready: true, 
				    babyId: req.body.babyId, 
				   });

    	query.exec(function (err, player) {
	    
	    mongoose.disconnect();

	    res.header("Access-Control-Allow-Origin", "*"); 
	    res.header("Access-Control-Allow-Headers", "X-Requested-With");
	    res.send(player);
	});
    });
}


/**
 * To switch from not ready to ready.
 */
exports.updatePlayerStatus = function(req, res, status){
    
    var ready_req = (status == true) ? false : true;

    console.log("update score player");

    db = mongoose.createConnection('localhost', 'asiance_babyfoot');

    var Player = db.model('Player', playerSchema);

    db.once('open', function () {

	var query = Player.find({position: req.position, babyId: req.babyId, ready: ready_req}).sort({ logged_at: 'desc'}).limit(4);
    	query.exec(function (err, player) {
    	    if (err) { console.log(err); }

	    //player.update({"ready": status });
	    mongoose.disconnect();
    	});
    });
};

/**
 * To switch from ready to notready.
 */
exports.unsubscriptPlayer = function(babyId,
				     position){
    

    console.log("unsubscript  player");

    db = mongoose.createConnection('localhost', 'asiance_babyfoot');

    var Player = db.model('Player', playerSchema);

    db.once('open', function () {

	Player.update({position: position, babyId: babyId, ready: true},{"ready": false },
		      function(){mongoose.disconnect();});
    });
};

/**
 * Update current player: score etc etc....
 */
exports.updatePlayerScore = function(babyId,
				     position, 
				     score){

    console.log("update me");

    db = mongoose.createConnection('localhost', 'asiance_babyfoot');

    var Player = db.model('Player', playerSchema);

    db.once('open', function () {

	Player.update({position: position, babyId: babyId, ready: true},
		      {stats: {	"score":  score}},
		      function(){mongoose.disconnect();});
    });
};






