mongoose = require("mongoose")

playerSchema = new mongoose.Schema(
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

  accessToken: String
  ready:
    type: Boolean
    default: false

  logged_at: Number
  babyId: Number
  gameID: String
  position: Number
  team: String
  stats:
    score: Number
)

module.exports.PlayerSchema = playerSchema

Player = module.exports = mongoose.model('Player', playerSchema)