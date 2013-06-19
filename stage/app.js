/**
 * ALL ON MOBILE
 *
 *
 */

/**
 * due to the asynchrone stuffs it is impossible to
 * write the database each time a score is changed...
 * so its done on unsubscript of the player.
 */
var score = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]
];

var message = [0, 0, 0, 0];

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
app.configure(function () {
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
  app.use(express.vhost('livegameup.asiance.com', app));
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
app.configure('development', function () {

  app.use(express.errorHandler());

  /**
   * General
   */
  app.get('/', function (req, res) {

    var ua = req.header('user-agent');
    if (/mobile/i.test(ua)) {

      res.render('index_mobile', { title: 'LiveGameUp!' });

    } else {

      res.render('index', { title: 'LiveGameUp!' });

    }
  });

  /**
   * Login
   */
  app.get('/login', function (req, res) {
    res.render('login', { title: 'Login' })
  });

  app.post('/login', function(req, res) {

      var player_logged = req.body;
      player.addPlayer(player_logged);

      var msg = {
        "score": "",
        "name": "",
        "picture": "",
        "position": "",
        "babyId": ""
      };

      msg.picture = '<img src="' + player_logged.picture + '">';
      msg.name = player_logged.first_name;
      msg.score = 0;
      msg.position = player_logged.position;
      msg.babyId = player_logged.babyId;

      message[player_logged.position - 1] = msg;

      // update the global score
      score[player_logged.babyId - 1][player_logged.position - 1] = 0;

      bayeux.getClient().publish('/admin', message);
      bayeux.getClient().publish('/index', message);

      res.send(req.body); // looback object to client to get SUCCESS status

  });

  /**
   * Admin
   */
  app.get('/admin', admin.admin);

  /**
   *
   */
  app.post('/player/setReady', function (req, res) {

//    player.setReady(req, res);
  });
  app.post('/player/setScores', function (req, res) {

    player.setScores(score);
    res.send(req.body);
  });

});


/**
 * Forwards message to the index page.
 */
var subscription = bayeux.getClient().subscribe('/controller', function (game_ctxt) {

  var msg = {
    "score": "",
    "name": "",
    "picture": "",
    "position": "",
    "babyId": ""
  };

  msg.picture = game_ctxt.picture;
  msg.name = game_ctxt.first_name;
  msg.score = game_ctxt.score;
  msg.position = game_ctxt.position;
  msg.babyId = game_ctxt.babyId;

  message[msg.position - 1] = msg;

  score[0][game_ctxt.position - 1] = game_ctxt.score;

  bayeux.getClient().publish('/index', message);

});

subscription.callback(function () {
  console.log('Subscription is now active!');
});

subscription.errback(function (error) {
  console.log(error.message);
});


bayeux.bind('subscribe', function (clientId, channel) {

  if (channel == "/index") {

    player.getCurrentPlayersForIndex(bayeux, score);

  }
});

bayeux.bind('unsubscribe', function (clientId, channel) {
});

bayeux.bind('publish', function (clientId, channel, data) {
});


bayeux.bind('disconnect', function (clientId) {
});


/**
 * Create server
 */
var server = http.createServer(app).listen(app.get('port'), function () {
  console.log("Express server listening on port " + app.get('port'));
});

/**
 * Attach Bayeux to it
 */
bayeux.attach(server);

