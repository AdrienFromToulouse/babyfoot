'use strict'

angular.module('baby').controller 'IndexController', ($scope, Faye) ->

  $scope.player1_photo = "/images/unknown.gif"   
  $scope.player2_photo = "/images/unknown.gif"   
  $scope.player3_photo = "/images/unknown.gif"   
  $scope.player4_photo = "/images/unknown.gif"

  subscription = Faye.subscribe "/index", (message) ->
    $scope.$apply ->
      switch message.cmd
        when "upScore"
          $scope.score_team1 = message.score_team1
          $scope.score_team2 = message.score_team2
        else
          $scope.player1_name = message[0].first_name   
          $scope.player2_name = message[1].first_name   
          $scope.player3_name = message[2].first_name   
          $scope.player4_name = message[3].first_name   

          $scope.player1_photo = message[0].picture   
          $scope.player2_photo = message[1].picture   
          $scope.player3_photo = message[2].picture   
          $scope.player4_photo = message[3].picture   

          if message[0].picture is ""
            $scope.player1_photo = "/images/unknown.gif"   
          if message[1].picture is ""
            $scope.player2_photo = "/images/unknown.gif"   
          if message[2].picture is ""
            $scope.player3_photo = "/images/unknown.gif"   
          if message[3].picture is ""
            $scope.player4_photo = "/images/unknown.gif"   

  subscription.callback ->
    console.log "Subscription is now active!"

  subscription.errback (error) ->
    alert error.message
  return


angular.module('baby').controller 'AdminController', ($scope, Faye, $http, $location) ->

  $scope.gameStarted = false

  $scope.score_team1 = 0
  $scope.score_team2 = 0
  $scope.player1_photo = "/images/unknown.gif"   
  $scope.player2_photo = "/images/unknown.gif"   
  $scope.player3_photo = "/images/unknown.gif"   
  $scope.player4_photo = "/images/unknown.gif"   

  subscription = Faye.subscribe "/admin", (message) ->

    $scope.$apply ->
      
      $scope.player1_name = message[0].first_name   
      $scope.player2_name = message[1].first_name   
      $scope.player3_name = message[2].first_name   
      $scope.player4_name = message[3].first_name   

      $scope.player1_photo = message[0].picture   
      $scope.player2_photo = message[1].picture   
      $scope.player3_photo = message[2].picture   
      $scope.player4_photo = message[3].picture   

      $scope.fbidp1 = message[0].fb_id
      $scope.fbidp2 = message[1].fb_id
      $scope.fbidp3 = message[2].fb_id
      $scope.fbidp4 = message[3].fb_id

      $scope.fbaccess1 = message[0].access_token
      $scope.fbaccess2 = message[1].access_token
      $scope.fbaccess3 = message[2].access_token
      $scope.fbaccess4 = message[3].access_token

  subscription.callback ->
    console.log "Subscription is now active!"

  subscription.errback (error) ->
    alert error.message

  $scope.startStop = ->
    if $scope.gameStarted is false
      $scope.score_team1 = 0
      $scope.score_team2 = 0
      $scope.gameStarted = true
    
      # Get the current logged player IDs
      players = new Array()
      players.push($($.find(".player")[0]).attr("data-fbidp"))
      players.push($($.find(".player")[1]).attr("data-fbidp"))
      players.push($($.find(".player")[2]).attr("data-fbidp"))
      players.push($($.find(".player")[3]).attr("data-fbidp"))

      $(".btnstst > div").toggleClass( "start stop")
     
      $http.post("/startStopGame"
        data: {cmd: "start", players: players}
      ).success((data, status) ->
      ).error (data, status) ->
    else
      # Get the current logged player IDs
      players = new Array()
      players.push($($.find(".player")[0]).attr("data-fbidp"))
      players.push($($.find(".player")[1]).attr("data-fbidp"))
      players.push($($.find(".player")[2]).attr("data-fbidp"))
      players.push($($.find(".player")[3]).attr("data-fbidp"))
   
      $(".btnstst > div").toggleClass( "stop start" )
      $http.post("/startStopGame"
        data: {cmd: "stop", players: players, score: {score_team1: $scope.score_team1, score_team2: $scope.score_team2}}
      ).success((data, status) ->
        
        $scope.score_team1 = 0
        $scope.score_team2 = 0
        $scope.player1_name = ""   
        $scope.player2_name = ""   
        $scope.player3_name = ""   
        $scope.player4_name = ""   
        $scope.player1_photo = "/images/unknown.gif"   
        $scope.player2_photo = "/images/unknown.gif"   
        $scope.player3_photo = "/images/unknown.gif"   
        $scope.player4_photo = "/images/unknown.gif"   
        $scope.fbidp1 = ""
        $scope.fbidp2 = ""
        $scope.fbidp3 = ""
        $scope.fbidp4 = ""
        $scope.gameStarted = false

      ).error (data, status) ->
        angular.noop()
        
  $scope.plus = (team) ->
    if $scope.gameStarted is true
      if team is "team1"
        if $scope.score_team1 < 10
          $scope.score_team1++
          if typeof $scope.fbidp1 isnt "undefined"
            FB.api $scope.fbidp1+"/objects/livegameup:point", "post",
              object: {title: "Goooooal!", url: "http://livegameup.asiance.com:3300/",image: "http://www.macommune.com/mod_turbolead/upload/image/ballon_foot_1.gif", description: "My team scored!", data: {points: $scope.score_team1}}
              access_token: $scope.fbaccess1
              , (response) ->
                console.log response.id
                FB.api $scope.fbidp1+"/livegameup:score", "post",
                  point: response.id
                  access_token: $scope.fbaccess1
                  , (response) ->
                  console.log "idstory"
                  console.log response.id

          if typeof $scope.fbidp2 isnt "undefined"
            FB.api $scope.fbidp2+"/objects/livegameup:point", "post",
              object: {title: "Goooooal!", url: "http://livegameup.asiance.com:3300/",image: "http://www.macommune.com/mod_turbolead/upload/image/ballon_foot_1.gif", description: "My team scored!", data: {points: $scope.score_team1}}
              access_token: $scope.fbaccess2
              , (response) ->
                console.log response.id
                FB.api $scope.fbidp2+"/livegameup:score", "post",
                  point: response.id
                  access_token: $scope.fbaccess2
                  , (response) ->
                  console.log "idstory"
                  console.log response.id

      else
        if $scope.score_team2 < 10
          $scope.score_team2++
          if typeof $scope.fbidp3 isnt "undefined"
            FB.api $scope.fbidp3+"/objects/livegameup:point", "post",
              object: {title: "Goooooal!", url: "http://livegameup.asiance.com:3300/",image: "http://www.macommune.com/mod_turbolead/upload/image/ballon_foot_1.gif", description: "My team scored!", data: {points: $scope.score_team2}}
              access_token: $scope.fbaccess3
              , (response) ->
                console.log response.id
                FB.api $scope.fbidp3+"/livegameup:score", "post",
                  point: response.id
                  access_token: $scope.fbaccess3
                  , (response) ->
                  console.log "idstory"
                  console.log response.id

          if typeof $scope.fbidp4 isnt "undefined"
            FB.api $scope.fbidp4+"/objects/livegameup:point", "post",
              object: {title: "Goooooal!", url: "http://livegameup.asiance.com:3300/",image: "http://www.macommune.com/mod_turbolead/upload/image/ballon_foot_1.gif", description: "My team scored!", data: {points: $scope.score_team2}}
              access_token: $scope.fbaccess4
              , (response) ->
                console.log response.id
                FB.api $scope.fbidp4+"/livegameup:score", "post",
                  point: response.id
                  access_token: $scope.fbaccess4
                  , (response) ->
                  console.log "idstory"
                  console.log response.id
                            
      Faye.publish('/controller', {cmd: "upScore", score_team1: $scope.score_team1, score_team2: $scope.score_team2});
      $http.post("/updateScore"
        data: {score_team1: $scope.score_team1, score_team2: $scope.score_team2}
      ).success((data, status) ->

      ).error (data, status) ->
        console.log "[Error][Controller] " + status

  $scope.minus = (team) ->
    if $scope.gameStarted is true
      if team is "team1"
        if $scope.score_team1 != 0 
          $scope.score_team1--
      else
        if $scope.score_team2 != 0 
          $scope.score_team2--        

      Faye.publish('/controller', {cmd: "upScore", score_team1: $scope.score_team1, score_team2: $scope.score_team2});
      $http.post("/updateScore"
        data: {score_team1: $scope.score_team1, score_team2: $scope.score_team2}
      ).success((data, status) ->

      ).error (data, status) ->
        console.log "[Error][Controller] " + status


  # splited = $location.absUrl().split("/")
  # splited[splited.length - 1]
  # switch splited[splited.length - 1]
  #   when "start"
  #     $http.post("/startStopGame"
  #       data: {cmd: "start"}
  #     ).success((data, status) ->
  #       angular.noop()
  #     ).error (data, status) ->
  #       angular.noop()
  #   when "stop"
  #    $http.post("/startStopGame"
  #       data: {cmd: "stop", players: players}
  #     ).success((data, status) ->
  #       angular.noop()
  #     ).error (data, status) ->
  #       angular.noop()
  #   else
  #     angular.noop()

  return

angular.module('baby').controller 'GamesController', ($scope, Faye, $http) ->

  $http(
    method: "GET"
    url: "/games"
  ).success((data, status, headers, config) ->
    $scope.games = data
    console.log data
  ).error (data, status, headers, config) ->
    angular.noop()

  subscription = Faye.subscribe "/games", (message) ->
    console.log message.length
    # $scope.$apply ->
    #   $scope.games = message

  subscription.callback ->
    console.log "Subscription is now active!"

  subscription.errback (error) ->
    alert error.message

  return


  