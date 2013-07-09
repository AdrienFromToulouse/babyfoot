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

  angular.module('baby').controller('AdminController', function($scope, Faye, $http) {
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
        return $scope.fbidp4 = message[3].fb_id;
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
        $("#startStop").find("img").attr("src", "../images/btn_stop.png");
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
        $("#startStop").find("img").attr("src", "../images/btn_start.png");
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
        }).error(function(data, status) {});
      }
    };
    $scope.plus = function(team) {
      if ($scope.gameStarted === true) {
        if (team === "team1") {
          if ($scope.score_team1 < 10) $scope.score_team1++;
        } else {
          if ($scope.score_team2 < 10) $scope.score_team2++;
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
          return console.log("[Error][LoginController] " + status);
        });
      }
    };
    $scope.minus = function(team) {
      if ($scope.gameStarted === true) {
        if (team === "team1") {
          if ($scope.score_team1 !== 0) $scope.score_team1--;
        } else {
          if ($scope.score_team2 !== 0) $scope.score_team2--;
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
          return console.log("[Error][LoginController] " + status);
        });
      }
    };
  });

}).call(this);
