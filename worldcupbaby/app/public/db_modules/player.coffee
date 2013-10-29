mongoose = require("mongoose")
  
# 
# Add player to the DB.
# param[in]: player_logged - the player who is logging.
#
exports.addPlayer = (player_logged) ->
  Player = mongoose.model("Player")
  player = new Player
          
  player.personal.name = player_logged.name
  player.personal.fb_id = player_logged.fb_id
  player.personal.first_name = player_logged.first_name
  player.personal.last_name = player_logged.last_name
  player.personal.name = player_logged.name
  player.personal.gender = player_logged.gender
  player.personal.locale = player_logged.locale
  player.personal.link = player_logged.link
  player.personal.picture = player_logged.picture
  player.personal.email = player_logged.email
  player.logged_at = new Date().getTime()
  player.babyId = player_logged.babyId
  player.position = player_logged.position
  player.accessToken = player_logged.accessToken

  console.log player_logged.position

  if (player_logged.position is "1") or (player_logged.position is "2")
    player.team = 1
  else
    player.team = 2
  player.stats.score = 0
  player.save (err) ->
    if err
      console.log "ERROR"
    else
      console.log "ADDED"

#
# param[in]: bayeux - server to handle the websocket messaging.
# param[in]: position - player position.
# param[in]: babyId   - babyfoot identifier.
# 
exports.getCurrentPlayers = (bayeux, position, babyId) ->
  message =
    score: ""
    name: ""
    picture: ""
    position: ""
    babyId: ""

  Player = mongoose.model("Player")

  query = Player.find(ready: true).limit(4)
  query.exec (err, players) ->
    i = 0
    while i < players.length
      message.picture = players[i].personal.picture
      message.name = players[i].personal.first_name
      message.score = players[i].stats.score
      message.position = players[i].position
      message.babyId = players[i].babyId
      bayeux.getClient().publish "/player/" + position + "/baby/" + babyId, message
      i++

#
# Gathers all the ready players to send to the index on index connect.
# param[in]: bayeux - server to handle the websocket messaging.
# param[in]: theScore - the score array.
#
exports.getCurrentPlayersForIndex = (bayeux) ->
  message = [0, 0, 0, 0]

  Player = mongoose.model("Player")
  query = Player.find().sort(logged_at: "desc").limit(4)
  query.exec (err, players) ->
    i = 0
    while i < players.length
      msg =
        first_name: ""
        picture: ""
        position: ""
        access_token: ""

      msg.picture = players[i].personal.picture
      msg.first_name = players[i].personal.first_name
      msg.position = players[i].position
      msg.access_token = players[i].accessToken
      message[msg.position - 1] = msg
      i++
    bayeux.getClient().publish "/index", message

#
# Gathers all the ready players to send to the admin on admin connect.
# param[in]: bayeux - server to handle the websocket messaging.
# param[in]: theScore - the score array.
#
exports.getCurrentPlayersForAdmin = (bayeux) ->
  message = [0, 0, 0, 0]

  Player = mongoose.model("Player")
  query = Player.find().sort(logged_at: "desc").limit(4)
  query.exec (err, players) ->
    i = 0
    while i < players.length
      msg =
        first_name: ""
        picture: ""
        position: ""
        access_token: ""

      msg.picture = players[i].personal.picture
      msg.first_name = players[i].personal.first_name
      msg.position = players[i].position
      msg.access_token = players[i].accessToken
      message[msg.position - 1] = msg
      i++
    bayeux.getClient().publish "/admin", message




#
# To switch from unready to ready on start.
#
exports.setScores = (score) ->

  Player = mongoose.model("Player")
 
  query = Player.find().sort(logged_at: "desc").limit(4)
  query.exec (err, players) ->
    i = 0
    while i < players.length
      position = players[i].position
      score[0][position - 1] = 0  if score[0][position - 1] < 0
      score[0][position - 1] = 10  if score[0][position - 1] > 10
      players[i].update
        ready: false
        stats:
          score: score[0][position - 1]
      , ->
        console.log "updated"
       i++

# 
# Check if the player corresponding to the facebook ID is still playing
# 
exports.isPlaying = (req, res) ->

  Player = mongoose.model("Player")

  query = Player.findOne(
    ready: true
    "personal.fb_id": req.params.fbid
  )
  query.exec (err, player) ->
    if player
      res.redirect "/"
    else
      res.render "expired",
        title: "LiveGameUp!"


#
# Gathers all the ready players to send to the game on games connect.
# param[in]: bayeux - server to handle the websocket messaging.
# 
exports.getCurrentPlayersForGame = (bayeux) ->
  # message = [0, 0, 0, 0]

  Player = mongoose.model("Player")
  query = Player.find()
  query.exec (err, players) ->
    # i = 0
    # while i < players.length
      # msg =
      #   first_name: ""
      #   picture: ""
      #   position: ""
      #   access_token: ""

      # msg.picture = players[i].personal.picture
      # msg.first_name = players[i].personal.first_name
      # msg.position = players[i].position
      # msg.access_token = players[i].accessToken
      # message[msg.position - 1] = msg
      # i++
    console.log players 
    bayeux.getClient().publish "/games", players

#
# After on READY clicked ; set player to READY 
# 
exports.setMeReady = (res, myPosition) ->
  
  Player = mongoose.model("Player")
  query = Player.find(position: myPosition).sort(logged_at: "desc").limit(8)
  query.exec (err, players) ->
    if players.length > 0
      players[0].update
        ready: true
      , ->
      res.send players[0]

#
# Reset READY flag of the last 10 players 
# 
exports.resetMeReady = () ->
  
  Player = mongoose.model("Player")
  query = Player.find().sort(logged_at: "desc").limit(10)
  query.exec (err, players) ->
    if players.length > 0
      i = 0
      while i < players.length
        players[i].update
          ready: false
        , ->
          console.log "updated"
        i++
    
    