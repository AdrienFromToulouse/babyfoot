(function() {
  var mongoose;

  mongoose = require("mongoose");

  exports.getRandomGuest = function(res) {
    var Guest, query;
    Guest = mongoose.model("Guest");
    query = Guest.find();
    return query.exec(function(err, guests) {
      var guestId;
      guestId = Math.floor((Math.random() * 4) + 0);
      return res.send(guests[guestId]);
    });
  };

}).call(this);
