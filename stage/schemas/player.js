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



exports.create_Schema = function(){

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

	logged_at: Number,
	channel: Number,
	gameID: String,
	//_game_id : { type: Schema.Types.ObjectId, ref: 'game' },

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

    return playerSchema;
}

/**
 * Define the schema
 */
function createSchema(){

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

	logged_at: Number,
	channel: Number,
	gameID: String,
	//_game_id : { type: Schema.Types.ObjectId, ref: 'game' },

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

    return playerSchema;
}


exports.getSchema = function(){

    return createSchema();
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

    var playerSchema = createSchema();

    db = mongoose.createConnection('localhost', 'asiance_babyfoot');

    var Player = db.model('Player', playerSchema);
    
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




