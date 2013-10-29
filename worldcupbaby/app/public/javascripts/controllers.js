(function() {
  'use strict';
  angular.module('baby').controller('IndexController', function($scope, Faye) {
    var subscription;
    $scope.player1_photo = "/images/unknown.gif";
    $scope.player2_photo = "/images/unknown.gif";
    $scope.player3_photo = "/images/unknown.gif";
    $scope.player4_photo = "/images/unknown.gif";
    subscription = Faye.subscribe("/index", function(message) {
      return $scope.$apply(function() {
        switch (message.cmd) {
          case "upScore":
            $scope.score_team1 = message.score_team1;
            return $scope.score_team2 = message.score_team2;
          default:
            $scope.player1_name = message[0].first_name;
            $scope.player2_name = message[1].first_name;
            $scope.player3_name = message[2].first_name;
            $scope.player4_name = message[3].first_name;
            $scope.player1_photo = message[0].picture;
            $scope.player2_photo = message[1].picture;
            $scope.player3_photo = message[2].picture;
            $scope.player4_photo = message[3].picture;
            if (message[0].picture === "") {
              $scope.player1_photo = "/images/unknown.gif";
            }
            if (message[1].picture === "") {
              $scope.player2_photo = "/images/unknown.gif";
            }
            if (message[2].picture === "") {
              $scope.player3_photo = "/images/unknown.gif";
            }
            if (message[3].picture === "") {
              return $scope.player4_photo = "/images/unknown.gif";
            }
        }
      });
    });
    subscription.callback(function() {
      return console.log("Subscription is now active!");
    });
    subscription.errback(function(error) {
      return alert(error.message);
    });
  });

  angular.module('baby').controller('AdminController', function($scope, Faye, $http, $location) {
    var subscription;
    $scope.gameStarted = false;
    $scope.score_team1 = 0;
    $scope.score_team2 = 0;
    $scope.player1_photo = "/images/unknown.gif";
    $scope.player2_photo = "/images/unknown.gif";
    $scope.player3_photo = "/images/unknown.gif";
    $scope.player4_photo = "/images/unknown.gif";
    subscription = Faye.subscribe("/admin", function(message) {
      return $scope.$apply(function() {
        $scope.player1_name = message[0].first_name;
        $scope.player2_name = message[1].first_name;
        $scope.player3_name = message[2].first_name;
        $scope.player4_name = message[3].first_name;
        $scope.player1_photo = message[0].picture;
        $scope.player2_photo = message[1].picture;
        $scope.player3_photo = message[2].picture;
        $scope.player4_photo = message[3].picture;
        $scope.fbidp1 = message[0].fb_id;
        $scope.fbidp2 = message[1].fb_id;
        $scope.fbidp3 = message[2].fb_id;
        $scope.fbidp4 = message[3].fb_id;
        $scope.fbaccess1 = message[0].access_token;
        $scope.fbaccess2 = message[1].access_token;
        $scope.fbaccess3 = message[2].access_token;
        return $scope.fbaccess4 = message[3].access_token;
      });
    });
    subscription.callback(function() {
      return console.log("Subscription is now active!");
    });
    subscription.errback(function(error) {
      return alert(error.message);
    });
    $scope.startStop = function() {
      var players;
      if ($scope.gameStarted === false) {
        $scope.score_team1 = 0;
        $scope.score_team2 = 0;
        $scope.gameStarted = true;
        players = new Array();
        players.push($($.find(".player")[0]).attr("data-fbidp"));
        players.push($($.find(".player")[1]).attr("data-fbidp"));
        players.push($($.find(".player")[2]).attr("data-fbidp"));
        players.push($($.find(".player")[3]).attr("data-fbidp"));
        $(".btnstst > div").toggleClass("start stop");
        return $http.post("/startStopGame", {
          data: {
            cmd: "start",
            players: players
          }
        }).success(function(data, status) {}).error(function(data, status) {});
      } else {
        players = new Array();
        players.push($($.find(".player")[0]).attr("data-fbidp"));
        players.push($($.find(".player")[1]).attr("data-fbidp"));
        players.push($($.find(".player")[2]).attr("data-fbidp"));
        players.push($($.find(".player")[3]).attr("data-fbidp"));
        $(".btnstst > div").toggleClass("stop start");
        return $http.post("/startStopGame", {
          data: {
            cmd: "stop",
            players: players,
            score: {
              score_team1: $scope.score_team1,
              score_team2: $scope.score_team2
            }
          }
        }).success(function(data, status) {
          $scope.score_team1 = 0;
          $scope.score_team2 = 0;
          $scope.player1_name = "";
          $scope.player2_name = "";
          $scope.player3_name = "";
          $scope.player4_name = "";
          $scope.player1_photo = "/images/unknown.gif";
          $scope.player2_photo = "/images/unknown.gif";
          $scope.player3_photo = "/images/unknown.gif";
          $scope.player4_photo = "/images/unknown.gif";
          $scope.fbidp1 = "";
          $scope.fbidp2 = "";
          $scope.fbidp3 = "";
          $scope.fbidp4 = "";
          return $scope.gameStarted = false;
        }).error(function(data, status) {
          return angular.noop();
        });
      }
    };
    $scope.plus = function(team) {
      if ($scope.gameStarted === true) {
        if (team === "team1") {
          if ($scope.score_team1 < 10) {
            $scope.score_team1++;
            if (typeof $scope.fbidp1 !== "undefined") {
              FB.api($scope.fbidp1 + "/objects/livegameup:point", "post", {
                object: {
                  title: "Goooooal!",
                  url: "http://livegameup.asiance.com:3300/",
                  image: "http://www.macommune.com/mod_turbolead/upload/image/ballon_foot_1.gif",
                  description: "My team scored!",
                  data: {
                    points: $scope.score_team1
                  }
                },
                access_token: $scope.fbaccess1
              }, function(response) {
                console.log(response.id);
                return FB.api($scope.fbidp1 + "/livegameup:score", "post", {
                  point: response.id,
                  access_token: $scope.fbaccess1
                }, function(response) {}, console.log("idstory"), console.log(response.id));
              });
            }
            if (typeof $scope.fbidp2 !== "undefined") {
              FB.api($scope.fbidp2 + "/objects/livegameup:point", "post", {
                object: {
                  title: "Goooooal!",
                  url: "http://livegameup.asiance.com:3300/",
                  image: "http://www.macommune.com/mod_turbolead/upload/image/ballon_foot_1.gif",
                  description: "My team scored!",
                  data: {
                    points: $scope.score_team1
                  }
                },
                access_token: $scope.fbaccess2
              }, function(response) {
                console.log(response.id);
                return FB.api($scope.fbidp2 + "/livegameup:score", "post", {
                  point: response.id,
                  access_token: $scope.fbaccess2
                }, function(response) {}, console.log("idstory"), console.log(response.id));
              });
            }
          }
        } else {
          if ($scope.score_team2 < 10) {
            $scope.score_team2++;
            if (typeof $scope.fbidp3 !== "undefined") {
              FB.api($scope.fbidp3 + "/objects/livegameup:point", "post", {
                object: {
                  title: "Goooooal!",
                  url: "http://livegameup.asiance.com:3300/",
                  image: "http://www.macommune.com/mod_turbolead/upload/image/ballon_foot_1.gif",
                  description: "My team scored!",
                  data: {
                    points: $scope.score_team2
                  }
                },
                access_token: $scope.fbaccess3
              }, function(response) {
                console.log(response.id);
                return FB.api($scope.fbidp3 + "/livegameup:score", "post", {
                  point: response.id,
                  access_token: $scope.fbaccess3
                }, function(response) {}, console.log("idstory"), console.log(response.id));
              });
            }
            if (typeof $scope.fbidp4 !== "undefined") {
              FB.api($scope.fbidp4 + "/objects/livegameup:point", "post", {
                object: {
                  title: "Goooooal!",
                  url: "http://livegameup.asiance.com:3300/",
                  image: "http://www.macommune.com/mod_turbolead/upload/image/ballon_foot_1.gif",
                  description: "My team scored!",
                  data: {
                    points: $scope.score_team2
                  }
                },
                access_token: $scope.fbaccess4
              }, function(response) {
                console.log(response.id);
                return FB.api($scope.fbidp4 + "/livegameup:score", "post", {
                  point: response.id,
                  access_token: $scope.fbaccess4
                }, function(response) {}, console.log("idstory"), console.log(response.id));
              });
            }
          }
        }
        Faye.publish('/controller', {
          cmd: "upScore",
          score_team1: $scope.score_team1,
          score_team2: $scope.score_team2
        });
        return $http.post("/updateScore", {
          data: {
            score_team1: $scope.score_team1,
            score_team2: $scope.score_team2
          }
        }).success(function(data, status) {}).error(function(data, status) {
          return console.log("[Error][Controller] " + status);
        });
      }
    };
    $scope.minus = function(team) {
      if ($scope.gameStarted === true) {
        if (team === "team1") {
          if ($scope.score_team1 !== 0) {
            $scope.score_team1--;
          }
        } else {
          if ($scope.score_team2 !== 0) {
            $scope.score_team2--;
          }
        }
        Faye.publish('/controller', {
          cmd: "upScore",
          score_team1: $scope.score_team1,
          score_team2: $scope.score_team2
        });
        return $http.post("/updateScore", {
          data: {
            score_team1: $scope.score_team1,
            score_team2: $scope.score_team2
          }
        }).success(function(data, status) {}).error(function(data, status) {
          return console.log("[Error][Controller] " + status);
        });
      }
    };
  });

  angular.module('baby').controller('GamesController', function($scope, Faye, $http) {
    var subscription;
    $http({
      method: "GET",
      url: "/games"
    }).success(function(data, status, headers, config) {
      $scope.games = data;
      return console.log(data);
    }).error(function(data, status, headers, config) {
      return angular.noop();
    });
    subscription = Faye.subscribe("/games", function(message) {
      return console.log(message.length);
    });
    subscription.callback(function() {
      return console.log("Subscription is now active!");
    });
    subscription.errback(function(error) {
      return alert(error.message);
    });
  });

}).call(this);
