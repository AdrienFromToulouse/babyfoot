(function() {
  var app, bayeux, db, express, faye, game, guest, http, message, mongoose, path, player, routes, server, subscription;

  message = [0, 0, 0, 0];

  express = require("express");

  routes = require("./routes");

  http = require("http");

  path = require("path");

  faye = require("faye");

  mongoose = require("mongoose");

  db = require("./db");

  game = require("./public/db_modules/game");

  guest = require("./public/db_modules/guest");

  player = require("./public/db_modules/player");

  app = express();

  app.configure(function() {
    app.set("port", process.env.PORT || 3300);
    app.set("views", __dirname + "/views");
    app.set("view engine", "jade");
    app.use(express.favicon(__dirname + "/public/images/favicon.ico"));
    app.use(express.logger("dev"));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express["static"](path.join(__dirname, "public")));
    return app.use(express.errorHandler({
      showStack: true,
      dumpExceptions: true
    }));
  });

  bayeux = new faye.NodeAdapter({
    mount: "/faye",
    timeout: 5
  });

  app.configure("development", function() {
    app.use(express.errorHandler());
    app.get("/", function(req, res) {
      var ua;
      ua = req.header("user-agent");
      if (/mobile/i.test(ua)) {
        return res.render("index_mobile", {
          title: "LiveGameUp!"
        });
      } else {
        return res.render("index", {
          title: "LiveGameUp!"
        });
      }
    });
    app.get("/me/:fbid", function(req, res) {
      return player.isPlaying(req, res);
    });
    app.post("/login/guest", function(req, res) {
      return guest.getRandomGuest(res);
    });
    app.post("/login/isready/:myPosition", function(req, res) {
      console.log(req.params.myPosition);
      return player.setMeReady(res, req.params.myPosition);
    });
    app.get("/login", function(req, res) {
      return res.render("login", {
        title: "Login"
      });
    });
    app.post("/login", function(req, res) {
      var msg, player_logged;
      player_logged = req.body;
      player.addPlayer(player_logged);
      msg = {
        score: "",
        first_name: "",
        picture: "",
        position: ""
      };
      msg.picture = player_logged.picture;
      msg.first_name = player_logged.first_name;
      msg.position = player_logged.position;
      msg.fb_id = player_logged.fb_id;
      msg.access_token = player_logged.accessToken;
      message[player_logged.position - 1] = msg;
      bayeux.getClient().publish("/admin", message);
      bayeux.getClient().publish("/index", message);
      return res.send(req.body);
    });
    app.get("/admin/:state", function(req, res) {
      return res.render("admin", {
        title: "Admin"
      });
    });
    app.get("/admin", function(req, res) {
      player.resetMeReady();
      game.resetMeReady();
      return res.render("admin", {
        title: "Admin"
      });
    });
    app.get("/game", function(req, res) {
      return res.render("games", {
        title: "Games"
      });
    });
    app.get("/games", game.getAllPlayedGame);
    app.post("/startStopGame", function(req, res) {
      switch (req.body.data.cmd) {
        case "start":
          return game.createNewGame();
        case "stop":
          return game.closeCurrentGame(req, res);
        default:
          return angular.noop();
      }
    });
    return app.post("/updateScore", function(req, res) {
      return game.updateScore(req, res);
    });
  });

  subscription = bayeux.getClient().subscribe("/controller", function(message) {
    return bayeux.getClient().publish("/index", message);
  });

  subscription.callback(function() {
    return console.log("Subscription is now active!");
  });

  subscription.errback(function(error) {
    return console.log(error.message);
  });

  bayeux.bind("subscribe", function(clientId, channel) {
    switch (channel) {
      case "/index":
        game.getCurrentScoreNPlayer(bayeux, channel);
        break;
      case "/admin":
        console.log("BEFORE ADMIN FILL");
        break;
      default:
        console.log("ELSE");
    }
  });

  bayeux.bind("unsubscribe", function(clientId, channel) {});

  bayeux.bind("publish", function(clientId, channel, data) {});

  bayeux.bind("disconnect", function(clientId) {});

  server = http.createServer(app).listen(app.get("port"), function() {
    return console.log("Express server listening on port " + app.get("port"));
  });

  bayeux.attach(server);

}).call(this);
