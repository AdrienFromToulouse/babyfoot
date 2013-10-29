mongoose = require("mongoose")

guestSchema = new mongoose.Schema(
  personal:
    fb_id: String
    first_name: String
    last_name: String
    name: String
    gender: String
    locale: String
    link: String
    picture: String
    email: String

  ready: #set to true on start button
    type: Boolean
    default: true

  logged_at: Number
  babyId: Number
  gameID: String
  position: Number
  team: String
  stats:
    score: Number
)

Guest = module.exports = mongoose.model("Guest", guestSchema)