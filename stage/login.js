/*
 * GET login page.
 */


/*-----------------------------------------------------------*/
/* Render the login page
 */
/*-----------------------------------------------------------*/
exports.show = function(req, res){

    res.render('login', { title: 'Login' });
};

/*-----------------------------------------------------------*/
/* Add player in the DB
 */
/*-----------------------------------------------------------*/
exports.addPlayer = function(req, res){

    console.log("addPlayer "+req.body.name);

    /*
     * includes
     */
    var mongoose = require('mongoose')
    , player = require('./schemas/player');

    /*
     * looback object to client to get SUCCESS status
     */
    res.send(req.body);
 
    /*
     * Connect and write DB
     */
    db = mongoose.createConnection('localhost', 'asiance_babyfoot');

    /* 
     * Declare new player
     */
    var playerSchema = player.getSchema();
    var Player = db.model('Player', playerSchema);
    var player = new Player;
   
    db.on('error', console.error.bind(console, 'connection add player error:'));
    db.on('close', console.error.bind(console, 'closed:'));
    db.on('open', console.error.bind(console, 'opened:'));

    db.once('open', function (err, db) {

	console.log("saved");

	player.personal.name = req.body.name;

	player.personal.fb_id = req.body.fb_id;
	player.personal.first_name = req.body.first_name;
	player.personal.last_name = req.body.last_name;
	player.personal.name = req.body.name;
	player.personal.gender = req.body.gender;
	player.personal.locale = req.body.locale;
	player.personal.link = req.body.link;
	player.personal.picture = req.body.picture;
	player.personal.email = req.body.email; 

	player.logged_at = new Date().getTime();
	player.channel = req.body.channel;
	player.position = req.body.position;
	player.channelID = "";

	if( (player.position == 1) || (player.position == 2) ){
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
	    mongoose.disconnect();
	});

	// For debug
	// Player.find(function (err, players) {
    	//     console.log(players);
	// });
    });
};
