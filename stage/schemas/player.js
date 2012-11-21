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
	score_attack: Number,  //scored as attacker
	score_defense: Number, //scored as defenser
	gamelles: Number,
	pissettes: Number,
	reprises: Number,
	cendriers: Number
    }
});


/**
 * Used in tests.
 *
 */
exports.getSchema = function(){
    return playerSchema;
};





/**
 * When a new Index page client connect...
 *
 */
exports.getCurrentPlayers = function(bayeux){

    var message = {
    	"score" :    [0, 0, 0, 0, 0, 0, 0, 0],
    	"gamelle" :  [0, 0, 0, 0, 0, 0, 0, 0],
    	"cendrier" : [0, 0, 0, 0, 0, 0, 0, 0],
    	"pissette" : [0, 0, 0, 0, 0, 0, 0, 0],
    	"reprise" :  [0, 0, 0, 0, 0, 0, 0, 0],
    	"player" :   [{"imageP1": "", 
    		       "firstnameP1": ""},
    		      {"imageP2": "", 
    		       "firstnameP2": ""},
    		      {"imageP3": "", 
    		       "firstnameP3": ""},
    		      {"imageP4": "", 
    		       "firstnameP4": ""}]
    };

    db = mongoose.createConnection('localhost', 'asiance_babyfoot');

    var Player = db.model('Player', playerSchema);
    var player = new Player;

    
    db.once('open', function () {


	var query = Player.find().sort({ logged_at: 'desc'}).limit(4);
    	query.exec(function (err, players) {

	    for(i = 0 ; i < PLYR_NBROF_PLAYER ; i++){

    		if(players[i]){

		    switch(players[i].position)
		    {
		    case 1:
			message.player[players[i].position-1].imageP1 = '<img src="'+players[i].personal.picture+'">';
			message.player[players[i].position-1].firstnameP1 = players[i].personal.first_name;
			message.score[P1_ATTACKER] = players[i].stats.score_attack;
			message.score[P1_DEFENSER] = players[i].stats.score_defense;
			break;
		    case 2:
			message.player[players[i].position-1].imageP2 = '<img src="'+players[i].personal.picture+'">';
			message.player[players[i].position-1].firstnameP2 = players[i].personal.first_name;
			message.score[P2_ATTACKER] = players[i].stats.score_attack;
			message.score[P2_DEFENSER] = players[i].stats.score_defense;
			break;
		    case 3:
			message.player[players[i].position-1].imageP3 = '<img src="'+players[i].personal.picture+'">';
			message.player[players[i].position-1].firstnameP3 = players[i].personal.first_name;
			message.score[P3_ATTACKER] = players[i].stats.score_attack;
			message.score[P3_DEFENSER] = players[i].stats.score_defense;
			break;
		    case 4:
			message.player[players[i].position-1].imageP4 = '<img src="'+players[i].personal.picture+'">';
			message.player[players[i].position-1].firstnameP4 = players[i].personal.first_name;
			message.score[P4_ATTACKER] = players[i].stats.score_attack;
			message.score[P4_DEFENSER] = players[i].stats.score_defense;
			break;
		    default:
			break;
		    }
		}
		bayeux.getClient().publish('/channel_index',message);
		mongoose.disconnect();
    	    }
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


    console.log(player_logged.babyId);
    console.log(player_logged.babyId);
    console.log(player_logged.babyId);
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
	player.stats.score_attack = 0;
	player.stats.score_defense = 0;
	player.stats.gamelles = 0;
	player.stats.pissettes = 0;
	player.stats.reprises = 0;
	player.stats.cendriers = 0;

	player.save(function (err) {
    	    if(err){
    		console.log('ERROR');
    	    }
	    console.log("[INFO] player logged saved");
	    mongoose.disconnect();
	});



	// For debug
	// Player.find(function (err, players) {
    	//     console.log(players);
	// });
    });
};




/**
 * After login it retrieve all the data corresponding to the current player (me)
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
exports.unsubscriptPlayer = function(babyId, position){
    

    console.log("unsubscript  player");

    db = mongoose.createConnection('localhost', 'asiance_babyfoot');

    var Player = db.model('Player', playerSchema);

    db.once('open', function () {

	Player.update({position: position, babyId: babyId, ready: true},{"ready": false },
		      function(){mongoose.disconnect();});
    });
};
