/**
 * ALL ON MOBILE
 *
 *
 */

/* player scores */
/** 
 * due to the asynchrone stuffs it is impossible to 
 * write the database each time a score is changed...
 * so its done on unsubscript of the player.
 */ 
var score = [[0,0,0,0],
	     [0,0,0,0],
	     [0,0,0,0],
	     [0,0,0,0]];

var message = [0,0,0,0];

/**
 * To catch the webbrowser close event it is needed to fire
 * a callback on Disconnect event. This callback parses the clients
 * array and set to False the ready state if found. 
 *
 */
var clients = new Array(100);

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
    app.set('port', process.env.PORT || 3300);
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


/**
 * Development: export NODE_ENV=development or NODE_ENV=development node app
 */
app.configure('development', function(){

    //console.log("ALL ON MOBILE STARTED IN development MODE");
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

    /**
     * Login
     */
//    app.get('/login:b/:p', login.show);

    app.get('/login', function(req, res){

	console.log("i am gonna render the login page");

	res.render('login', { title: 'Login' })
    });

    


    /**
     * Admin
     */
    app.get('/admin', admin.admin);


    /**
     * READ one specific player
     */
    app.post('/player/getme', function(req, res){
  
  	player.getAplayer(req, res);
    });

});


/**
 * Write the databse with player's data from login page.
 */
var subscription_log = bayeux.getClient().subscribe('/controller/logplayer', function(player_logged) {

    player.addPlayer(player_logged);

});

subscription_log.callback(function() {
    console.log('Subscription_init is now active!');
});

subscription_log.errback(function(error) {
    console.log(error.message);
});

/**
 * Forwards message to other players having the same babyID.
 * Forwards message to the index page.
 */
var subscription = bayeux.getClient().subscribe('/controller', function(game_ctxt) {


    /* and then send his context to the others */
    switch(eval(game_ctxt.position))
    {
    case 1: 
	bayeux.getClient().publish('/player/2/baby/'+game_ctxt.babyId, game_ctxt);
	bayeux.getClient().publish('/player/3/baby/'+game_ctxt.babyId, game_ctxt);
	bayeux.getClient().publish('/player/4/baby/'+game_ctxt.babyId, game_ctxt);
	break;
    case 2:
	bayeux.getClient().publish('/player/1/baby/'+game_ctxt.babyId, game_ctxt);
	bayeux.getClient().publish('/player/3/baby/'+game_ctxt.babyId, game_ctxt);
	bayeux.getClient().publish('/player/4/baby/'+game_ctxt.babyId, game_ctxt);
	break;
    case 3:
	bayeux.getClient().publish('/player/1/baby/'+game_ctxt.babyId, game_ctxt);
	bayeux.getClient().publish('/player/2/baby/'+game_ctxt.babyId, game_ctxt);
	bayeux.getClient().publish('/player/4/baby/'+game_ctxt.babyId, game_ctxt);
	break;
    case 4:
	bayeux.getClient().publish('/player/1/baby/'+game_ctxt.babyId, game_ctxt);
	bayeux.getClient().publish('/player/2/baby/'+game_ctxt.babyId, game_ctxt);
	bayeux.getClient().publish('/player/3/baby/'+game_ctxt.babyId, game_ctxt);
	break;
    default:
    }


    var msg = {
    	"score" :   "",
    	"name" :  "",
	"picture": "",
	"position": "",
	"babyId": ""
    };

    msg.picture = '<img src="'+game_ctxt.picture+'">';
    msg.name = game_ctxt.first_name;
    msg.score = game_ctxt.score;
    msg.position = game_ctxt.position;
    msg.babyId = game_ctxt.babyId;

    message[msg.position - 1] = msg;
  
    score[game_ctxt.babyId - 1][game_ctxt.position - 1] = game_ctxt.score;


    /* get all ready players */
///    player.getCurrentPlayersForIndex(bayeux);

    /*get all ready players and compute the global context to be send
      or update a global context based in index ICD?*/
    bayeux.getClient().publish('/index',message);
});

subscription.callback(function() {
    console.log('Subscription is now active!');
});

subscription.errback(function(error) {
    console.log(error.message);
});


bayeux.bind('subscribe', function(clientId, channel) {
    // console.log('[SUBSCRIBE] ' + clientId + ' -> ' + channel);

    if(channel == "/index"){

	//console.log('[SUBSCRIBE INDEX] ' + clientId + ' -> ' + channel);
	//TODO in get function take the babyId into account
	player.getCurrentPlayersForIndex(bayeux, score);
    }
    else{

	/* whatever the case-sensitive */
	if( channel.match(/player/i) ){

	    var elem = channel.split('/');
	    var position = elem[2] - 0;
	    var babyId = elem[4] - 0;

	    var clt = {
		id: clientId,
		channel: channel
	    };

	    //console.log('[SUBSCRIBE] ' + clientId + ' -> ' + channel);

	    clients.push(clt);

	    player.getCurrentPlayers(bayeux, position, babyId);
	}
    }
});

bayeux.bind('unsubscribe', function(clientId, channel) {
//     console.log('[UNSUBSCRIBE] ' + clientId + ' -> ' + channel);
    
    var elem = channel.split('/');

    var position = elem[2] - 0;
    var babyId = elem[4] - 0;

    /* Set the started status to false */
    if( elem[3] == 'baby'){

	//console.log('[UNSUBSCRIBE] ' + clientId + ' -> ' + channel);


	if(score[babyId - 1][position - 1] < 0){
	    score[babyId - 1][position - 1] = 0;
	}
	if(score[babyId - 1][position - 1] > 10){
	    score[babyId - 1][position - 1] = 10;
	}
	player.unsubscriptPlayer(babyId, position, score[babyId - 1][position - 1]);

	for(elt in clients){

	    if(clients[elt].id == clientId){

		//console.log('[SPLICE] ' + clientId + ' -> ' + channel);


		clients.splice(elt,1);
	    }
	}
    }
});

bayeux.bind('publish', function(clientId, channel, data) {
    //console.log('[PUBLISH] ' + clientId + ' -> ' + channel + ' -> ' + data);
});


bayeux.bind('disconnect', function(clientId) {
   // console.log('[ DISCONNECT] ' + clientId);

    for(elt in clients){

	if(clients[elt].id == clientId){

	    var elem = clients[elt].channel.split('/');

	    var position = elem[2] - 0;
	    var babyId = elem[4] - 0;

	    /* Set the started status to false */
	    if(elem[3] == 'baby'){

		console.log(score[babyId - 1][position - 1]);
	  
		if(score[babyId - 1][position - 1] < 0){
		    score[babyId - 1][position - 1] = 0;
		}
		if(score[babyId - 1][position - 1] > 10){
		    score[babyId - 1][position - 1] = 10;
		}

		player.unsubscriptPlayer(babyId, position, score[babyId - 1][position - 1]);

		clients.splice(elt,1);
	    }
	}
    }

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

