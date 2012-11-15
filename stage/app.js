/**
 * ALL ON MOBILE
 *
 *
 */


/**
 * Module dependencies.
 */

var express = require('express')
, routes = require('./routes')
, admin = require('./admin')
, login = require('./login')
, http = require('http')
, path = require('path')
, faye = require('faye')
, mongoose = require('mongoose')
, game = require('./schemas/game')
, player = require('./schemas/player');

/**
 * APP variable
 *
 */
var app = express();


/**
 * Config
 */
app.configure(function(){
    app.set('port', process.env.PORT || 3100);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.errorHandler({showStack: true, dumpExceptions: true}));
    app.use(express.vhost('livegameup.asiance-dev.com', app));
});


/**
 * Create Bayeux "server"
 */
var bayeux = new faye.NodeAdapter({
    mount: '/faye',
    timeout: 5
});



var game_idx_ctxt = {
    "started" : "",
    "cmd" : "",
    "change_team1": "", //count the nbrof changes in the team during a game
    "change_team2": "",
    //p1a p2a p3a p4a p1d p2d p3d p4d
    "score" :    [0, 0, 0, 0, 0, 0, 0, 0],
    "player" :   [{"imageP1": "", 
		   "firstnameP1": ""},{
		       "imageP2": "", 
		       "firstnameP2": ""},{
			   "imageP3": "", 
			   "firstnameP3": ""},{
			       "imageP4": "", 
			       "firstnameP4": ""}]
};



/**
 * Init game_idx_ctxt.
 *
 */
function initGame_ctxt(game_idx_ctxt){

    game_idx_ctxt.player[0].imageP1 = '';
    game_idx_ctxt.player[0].firstnameP1 = '';
    game_idx_ctxt.player[1].imageP2 = '';
    game_idx_ctxt.player[1].firstnameP2 ='';
    game_idx_ctxt.player[2].imageP3 = '';
    game_idx_ctxt.player[2].firstnameP3 ='';
    game_idx_ctxt.player[3].imageP4 = '';
    game_idx_ctxt.player[3].firstnameP4 ='';
}


/**
 * Convert logged_player message to game_idx_ctxt message.
 *
 */
function logplayToGame_ctxt(logged_player){

    switch(eval(logged_player.position)){

    case 1:
	// player one
	game_idx_ctxt.player[0].imageP1 = '<img src="'+logged_player.picture+'">';
	game_idx_ctxt.player[0].firstnameP1 =logged_player.first_name;
	break;
    case 2:
	// player 2
	game_idx_ctxt.player[1].imageP2 = '<img src="'+logged_player.picture+'">';
	game_idx_ctxt.player[1].firstnameP2 =logged_player.first_name;
	break;
    case 3:
	// player 3
	game_idx_ctxt.player[2].imageP3 = '<img src="'+logged_player.picture+'">';
	game_idx_ctxt.player[2].firstnameP3 =logged_player.first_name;
	break;
    case 4:
	// player 4
	game_idx_ctxt.player[3].imageP4 = '<img src="'+logged_player.picture+'">';
	game_idx_ctxt.player[3].firstnameP4 =logged_player.first_name;
	break;
    default:
	console.log("default");
    }

    return game_idx_ctxt;
}




/**
 * Capture websocket post from the player logging himself
 */
app.post('/logged_player', function(req, res) {

    bayeux.getClient().publish('/channel_admin',req.body);
    res.send(req.body);

//for now 
    // var game_ctxt = logplayToGame_ctxt(req.body);
    // bayeux.getClient().publish('/channel_index',game_ctxt);
});


/**
 * Development: export NODE_ENV=development or NODE_ENV=development node app
 */
app.configure('development', function(){

    console.log("STARTED IN development MODE");
    app.use(express.errorHandler());

    /**
     * General
     */
    app.get('/', function(req, res){

	var ua = req.header('user-agent');
	if(/mobile/i.test(ua)) {

	    res.render('index_mobile', { title: 'LiveGameUp!' });

	} else {
	    res.render('index', { title: 'LiveGameUp!' });
  	}
    });

    // var NBROF_CHANNELS = 4;
    /**
     * Login
     */
    app.get('/login', login.show);
    app.post('/login', login.addPlayer); // add player to the database

    /**
     * Admin
     */
    app.get('/admin', admin.admin);
});

/**
 * Treat incoming message from admin and redispatch to index page
 */
var subscription = bayeux.getClient().subscribe('/admin', function(message) {

    switch(message.cmd)
    {
    case "start":
	game.createNewGame();

	break;
    case "stop":
	initGame_ctxt(game_idx_ctxt)

	game.closeCurrentGame();

	break;
    case "updateScore":
	game.updateScore(message);
	player.updateScore(message);
	break;
    default:
    }
   
    if(message.newsubscription == 1){

	/** if new subscription read DB and send current data. 
	 *  It will send the message to all the subscriters, even those already subscripted.
	 */
        player.getCurrentPlayers(bayeux);
    }
    else{
	/* just forward the admin message */
	bayeux.getClient().publish('/channel_index',message);
    }
});


subscription.callback(function() {
    console.log('Subscription is now active!');
});

subscription.errback(function(error) {
    console.log(error.message);
});


/**
 * Create server
 */
var server = http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});

/**
 * Attach Bayeux to it
 */
bayeux.attach(server);

