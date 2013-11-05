message = [0, 0, 0, 0]

# Module dependencies
express = require("express")
routes = require("./routes")
http = require("http")
path = require("path")
faye = require("faye")
mongoose = require("mongoose")
db = require("./db")
game = require("./public/db_modules/game")
guest = require("./public/db_modules/guest")
player = require("./public/db_modules/player")
app = express()


# Config
app.configure ->
  app.set "port", process.env.PORT or 3300
  app.set "views", __dirname + "/views"
  app.set "view engine", "jade"
  app.use express.favicon(__dirname + "/public/images/favicon.ico")
  app.use express.logger("dev")
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use app.router
  app.use express.static(path.join(__dirname, "public"))
  app.use express.errorHandler(
    showStack: true
    dumpExceptions: true
  )

#Create Bayeux "server"
bayeux = new faye.NodeAdapter(
  mount: "/faye"
  timeout: 5
)

app.configure "development", ->
  app.use express.errorHandler()
  
  app.get "/", (req, res) ->
    ua = req.header("user-agent")
    if /mobile/i.test(ua)
      res.render "index_mobile",
        title: "LiveGameUp!"

    else
      res.render "index",
        title: "LiveGameUp!"

  app.get "/me/:fbid", (req, res) ->
    player.isPlaying req, res
  
  app.post "/login/guest", (req, res) ->
    guest.getRandomGuest res

  app.post "/login/isready/:myPosition", (req, res) ->
    console.log req.params.myPosition

    player.setMeReady res, req.params.myPosition

  app.get "/login", (req, res) ->
    res.render "login",
      title: "Login"

  app.post "/login", (req, res) ->
    player_logged = req.body
    player.addPlayer player_logged
    msg =
      score: ""
      first_name: ""
      picture: ""
      position: ""

    msg.picture = player_logged.picture
    msg.first_name = player_logged.first_name
    msg.position = player_logged.position
    msg.fb_id = player_logged.fb_id
    msg.access_token = player_logged.accessToken
    message[player_logged.position - 1] = msg
    bayeux.getClient().publish "/admin", message
    bayeux.getClient().publish "/index", message
    res.send req.body
  
  app.get "/admin/:state", (req, res) ->
    res.render "admin",
      title: "Admin"

  app.get "/admin", (req, res) ->
    player.resetMeReady()
    game.resetMeReady()
    res.render "admin",
      title: "Admin"

  app.get "/game", (req, res) ->
    res.render "games",
      title: "Games"

  app.get "/games", game.getAllPlayedGame
                                                                                                
  app.post "/startStopGame", (req, res) ->
    switch req.body.data.cmd
      when "start"
        game.createNewGame()
      when "stop"
        game.closeCurrentGame req, res
        message = [0, 0, 0, 0]
      else
        angular.noop()

  app.post "/updateScore", (req, res) ->
    game.updateScore req, res

#
# Forwards message to the index page.
subscription = bayeux.getClient().subscribe("/controller", (message) ->
  bayeux.getClient().publish "/index", message
)
subscription.callback ->
  console.log "Subscription is now active!"

subscription.errback (error) ->
  console.log error.message

bayeux.bind "subscribe", (clientId, channel) ->
  switch channel
    when "/index"
      game.getCurrentScoreNPlayer bayeux, channel
    when "/admin"
      console.log "BEFORE ADMIN FILL"
      #game.getCurrentScoreNPlayer bayeux, channel
    else
      console.log "ELSE"
  return
bayeux.bind "unsubscribe", (clientId, channel) ->
  return
bayeux.bind "publish", (clientId, channel, data) ->
  return
bayeux.bind "disconnect", (clientId) ->
  return

# Create server

server = http.createServer(app).listen(app.get("port"), ->
  console.log "Express server listening on port " + app.get("port")
)

# Attach Bayeux to it
bayeux.attach server