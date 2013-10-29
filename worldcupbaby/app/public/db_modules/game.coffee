mongoose = require("mongoose")

player = require("./player")

#
# On start, get the new game ID and set it to each current players.
#
exports.createNewGame = ->

  Game = mongoose.model("Game")
  Player = mongoose.model("Player")
 
  newgame = new Game

  newgame.created_at = new Date().getTime()
  newgame.started_at = new Date().getTime()
  newgame.stopped_at = 0
  newgame.duration = 0
  newgame.score_team1 = 0
  newgame.score_team2 = 0
  newgame.started = true
  newgame.save (err) ->
    throw err  if err
    query = Game.find().sort(created_at: "desc").limit(1)
    query.exec (err, game) ->
      throw err  if err
      # get the last game ID created 
      game_id = game[game.length - 1]._id
      Player.find(ready: true).sort(logged_at: "desc").limit(4).exec (err, players) ->
        throw err  if err
        game_id = game_id.toString(16)
        player = undefined
        i = undefined
        i = 0
        while i < players.length
          newgame.players.push players[i]
          i++
        newgame.save (err) ->
          return handleError(err) if err

#
# Set the stop date of a game
#
exports.closeCurrentGame = (req, res) ->

  Game = mongoose.model("Game")
  Player = mongoose.model("Player")
  
  query = Game.find().sort(created_at: "desc").limit(1)
  query.exec (err, game) ->
    throw err  if err
    stopAt = new Date().getTime()
    duration = stopAt - game[game.length - 1].started_at
    Game.update
      _id: game[game.length - 1]._id
    ,
      started: false
      stopped_at: stopAt
      duration: duration
      score_team1: req.body.data.score.score_team1
      score_team2: req.body.data.score.score_team2
    , (err) ->
      throw err  if err
            
      Player.find(ready: true).sort(logged_at: "desc").limit(8).exec (err, players) ->
        throw err  if err
        player = undefined
        i = undefined
        i = 0
        while i < players.length
          player = players[i]
          player.update
            ready: false
          , (err) ->
            throw err  if err
          i++
        res.send req.body

exports.updateScore = (req, res) ->

  Game = mongoose.model("Game")
  query = Game.find().sort(created_at: "desc").limit(1)

  query.exec (err, game) ->
    throw err  if err
    Game.update
      _id: game[game.length - 1]._id
    ,
      score_team1: req.body.data.score_team1
      score_team2: req.body.data.score_team2
    , (err) ->
      throw err  if err
      res.send req.body

exports.getCurrentScoreNPlayer = (bayeux, channel) ->

  Game = mongoose.model("Game")
  query = Game.find({started: true})
  
  query.exec (err, game) ->
    unless game.length is 0
      switch channel
        when "/index"
          bayeux.getClient().publish "/index",
            cmd: "upScore"
            score_team1: game[0].score_team1
            score_team2: game[0].score_team2

          message = [0, 0, 0, 0]
          i = 0
          while i < game[0].players.length
            msg =
              first_name: ""
              picture: ""
              position: ""
              access_token: ""

            msg.picture = game[0].players[i].personal.picture
            msg.first_name = game[0].players[i].personal.first_name
            msg.position = game[0].players[i].position
            msg.access_token = game[0].players[i].accessToken
            message[msg.position - 1] = msg
            i++
          bayeux.getClient().publish "/index", message

        when "/admin"
          # bayeux.getClient().publish "/admin",
          #   cmd: "upScore"
          #   score_team1: game[0].score_team1
          #   score_team2: game[0].score_team2

          message = [0, 0, 0, 0]
          i = 0
          while i < game[0].players.length
            console.log "getCurrentScoreNPlayer FOR ADMIN"

            msg =
              first_name: ""
              picture: ""
              position: ""
              access_token: ""

            msg.picture = game[0].players[i].personal.picture
            msg.first_name = game[0].players[i].personal.first_name
            msg.position = game[0].players[i].position
            msg.access_token = game[0].players[i].accessToken
            message[msg.position - 1] = msg
            i++
          bayeux.getClient().publish "/admin", message
        else
          console.log "ELSE"

exports.getAllPlayedGame = (req, res) ->
  Game = mongoose.model("Game")
  query = Game.find()
  
  query.exec (err, games) ->
    unless games.length is 0
      res.json games
      # bayeux.getClient().publish "/games",
      # player.getCurrentPlayersForGame bayeux

#
# Reset STARTED flag of the last 10 games 
# 
exports.resetMeReady = () ->
  
  Game = mongoose.model("Game")
  query = Game.find().sort(started_at: "desc").limit(10)
  query.exec (err, games) ->
    if games.length > 0
      i = 0
      while i < games.length
        games[i].update
          started: false
        , ->
          console.log "updated game"
        i++

