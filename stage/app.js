var message = [0, 0, 0, 0];

/**
 * Module dependencies.
 */
var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , faye = require('faye')
  , mongoose = require('mongoose')
  , game = require('./schemas/game')
  , guest = require('./schemas/guest')
  , player = require('./schemas/player');

/**
 * Init the APP variable
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
   *
   */
  app.get('/me/:fbid', function (req, res) {
    player.isPlaying(req, res);
  });

  /**
   * Login
   */
  app.post('/login/guest', function (req, res) {
    guest.getRandomGuest(res);
  });

  app.get('/login', function (req, res) {
    res.render('login', { title: 'Login' })
  });

  app.post('/login', function(req, res) {
      var player_logged = req.body;
      player.addPlayer(player_logged);

      var msg = {
        "score": "",
        "first_name": "",
        "picture": "",
        "position": "",
      };

      msg.picture = player_logged.picture;
      msg.first_name = player_logged.first_name;
      msg.position = player_logged.position;
      msg.fb_id = player_logged.fb_id;

      message[player_logged.position - 1] = msg;

      bayeux.getClient().publish('/admin', message);
      bayeux.getClient().publish('/index', message);

      res.send(req.body);
  });

  /**
   * Admin
   */
  app.get('/admin', function (req, res) {
    res.render('admin', { title: 'Admin' })
  });
  /**
   * 
   */
  app.post('/startStopGame', function (req, res) {
      switch(req.body.data.cmd)
      {
      case "start":
	  game.createNewGame();
	  break;
      case "stop":
	  game.closeCurrentGame(req, res);
	  break;
      default:
      }
  });

  app.post('/updateScore', function (req, res) {
      game.updateScore(req, res);
  });
});


/**
 * Forwards message to the index page.
 */
var subscription = bayeux.getClient().subscribe('/controller', function (message) {

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
	game.getCurrentScoreNPlayer(bayeux);
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

