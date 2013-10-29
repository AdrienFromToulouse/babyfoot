(function() {
  var dbURI, mongoose;

  mongoose = require("mongoose");

  dbURI = "mongodb://localhost/asiance_babyfoot";

  mongoose.connect(dbURI);

  mongoose.connection.on("connected", function() {
    return console.log("Mongoose default connection open to " + dbURI);
  });

  mongoose.connection.on("error", function(err) {
    return console.log("Mongoose default connection error: " + err);
  });

  mongoose.connection.on("disconnected", function() {
    return console.log("Mongoose default connection disconnected");
  });

  process.on("SIGINT", function() {
    return mongoose.connection.close(function() {
      console.log("Mongoose default connection disconnected through app termination");
      return process.exit(0);
    });
  });

  require("./public/models/player_model");

  require("./public/models/game_model");

  require("./public/models/guest_model");

}).call(this);
