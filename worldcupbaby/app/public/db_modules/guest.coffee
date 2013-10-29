mongoose = require("mongoose")

#
# Get a random guest
#
exports.getRandomGuest = (res) ->

  Guest = mongoose.model("Guest")
  query = Guest.find()
  query.exec (err, guests) ->
    guestId = Math.floor((Math.random() * 4) + 0)
    res.send guests[guestId]