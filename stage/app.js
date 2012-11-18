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


var clients = new Array();

/**
 * Development: export NODE_ENV=development or NODE_ENV=development node app
 */
app.configure('development', function(){

    console.log("ALL ON MOBILE STARTED IN development MODE");
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
    app.get('/login', login.show);

    /**
     * Admin
     */
    app.get('/admin', admin.admin);


    /**
     * READ one specific player
     */
    app.post('/player/getme', function(req, res){
  

  	player.getAplayer(req, res);
//	res.send(req.body);
    });


});


/**
 * Write the databse with player's data from login page.
 */
var subscription_log = bayeux.getClient().subscribe('/controller/logplayer', function(player_logged) {

    console.log("ADD PLAYER _______________");
    player.addPlayer(player_logged);

});

subscription_log.callback(function() {
    console.log('Subscription_init is now active!');
});

subscription_log.errback(function(error) {
    console.log(error.message);
});

/**
 * Forwards message to other players with the same babyID.
 * Forwards message to the index page.
 */
var subscription = bayeux.getClient().subscribe('/controller', function(game_ctxt) {


    console.log("HERE");
    //TODO here update database
    //database: takes player according to game id and strated set to true
    //reset started to false
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

//    bayeux.getClient().publish('/index',controller_to_public);
});

subscription.callback(function() {
    console.log('Subscription is now active!');
});

subscription.errback(function(error) {
    console.log(error.message);
});


bayeux.bind('subscribe', function(clientId, channel) {
    console.log('[SUBSCRIBE] ' + clientId + ' -> ' + channel);
    clients.push( {clientId: clientId , channel: channel} );
});

bayeux.bind('unsubscribe', function(clientId, channel) {
    console.log('[UNSUBSCRIBE] ' + clientId + ' -> ' + channel);

    //TODO: set the started status to false
    //updatePlayer(game.ctxt.player_ready = false);

    for( var i=0 ; i < clients.length ; i++) {
        if( clients[i].clientId == clientId ) {
            clients.splice(i, 1);
	    console.log('[UNSUBSCRIBED CLIENT] ' + clientId);
            break;
        }
    }
    for( var i=0 ; i < clients.length ; i++ ){

	console.log('[NEW CLIENT ARRAY AFTER DELETE'+ i + ']' + clients[i].clientId);
    }
});

bayeux.bind('publish', function(clientId, channel, data) {
    console.log('[PUBLISH] ' + clientId + ' -> ' + channel + ' -> ' + data);
    // for( var i=0 ; i < clients.length ; i++ ){
    // 	console.log('[CLIENT '+ i + '] ' + clients[0].clientId);
    // 	//bayeux.getClient().publish(channel,game_ctxt);
    // }
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

