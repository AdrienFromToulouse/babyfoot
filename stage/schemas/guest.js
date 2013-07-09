/**
 * Include
 */
var mongoose = require('mongoose');


/**
 * Defines the guest's schema.
 *
 */
var guestSchema = new mongoose.Schema({

  personal: {

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

  ready: { type: Boolean, default: true }, //set to true on start button
  logged_at: Number,
  babyId: Number,
  gameID: String,

  position: Number,
  team: String,

  stats: {
    score: Number,
  }
});

/**
 * Get a random guest.
 *
 */
exports.getRandomGuest = function (res) {

  db = mongoose.createConnection('localhost', 'asiance_babyfoot');

  var Guest = db.model('Guest', guestSchema);

  db.once('open', function () {

    var query = Guest.find();
    query.exec(function (err, guests) {

      var guestId = Math.floor((Math.random()*4)+0);
      res.send(guests[guestId]);
      mongoose.disconnect();
    });
  });
};