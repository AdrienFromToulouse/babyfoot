mongoose = require("mongoose")

# Build the connection string
dbURI = "mongodb://localhost/asiance_babyfoot"

# Create the database connection
mongoose.connect dbURI

# CONNECTION EVENTS
# When successfully connected
mongoose.connection.on "connected", ->
  console.log "Mongoose default connection open to " + dbURI


# If the connection throws an error
mongoose.connection.on "error", (err) ->
  console.log "Mongoose default connection error: " + err


# When the connection is disconnected
mongoose.connection.on "disconnected", ->
  console.log "Mongoose default connection disconnected"


# If the Node process ends, close the Mongoose connection
process.on "SIGINT", ->
  mongoose.connection.close ->
    console.log "Mongoose default connection disconnected through app termination"
    process.exit 0

require("./public/models/player_model")
require("./public/models/game_model")
require("./public/models/guest_model")
