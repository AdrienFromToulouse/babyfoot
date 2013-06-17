var babyAdmin = {

  GameCtxt: {

    "babyId": "",
    "position": "",
    "ready": "",
    "score": "",
    "picture": "",
    "first_name": "",
    "partner_position": "",
    "score_t1": 0,
    "score_t2": 0
  },

  /**
   *
   *
   */
  init_connection: function () {
    var client = new Faye.Client('/faye');
    return client;
  },

  /**
   * Sends to the controller.
   *
   * @param[in] - buffer_out: data to send.
   * @param[in] - client: instance of client.
   */
  send: function (client, buffer_out) {
    var publication = client.publish('/controller', buffer_out);

    publication.callback(function () {
      console.log('Message received by server!');
    });

    publication.errback(function (error) {
      console.log('There was a problem: ' + error.message);
    });
  },

  /**
   * Creates admin channel to get info of the players.
   *
   * @param[in] - client: instance of client.
   */
  subscript: function (client) {

    var subscription = client.subscribe('/admin', function (game_ctxt) {

	console.log(game_ctxt);


	var i = 0;
	for(i = 0 ; i < 4 ; i++){
            var playerX = "#player" + game_ctxt[i].position;
	    $(playerX).attr("data-name", game_ctxt[i].name);
	    $(playerX).attr("data-babyid", game_ctxt[i].babyId);
	    $(playerX).attr("data-picture", game_ctxt[i].picture);
	    $(playerX).attr("data-score", game_ctxt[i].score);

	    htmlString = '<p>' + game_ctxt[i].name + '</p>';
            $(playerX + " .pname").html(htmlString);

	}

	var score_t1 = parseInt(game_ctxt[0].score) + parseInt(game_ctxt[1].score);
	var score_t2 = parseInt(game_ctxt[2].score) + parseInt(game_ctxt[3].score);

	var newclass1 = "scores-big_0"+score_t1;
	var newclass2 = "scores-big_0"+score_t2;

	$("#score_team1").attr("class",newclass1);
	$("#score_team2").attr("class",newclass2);

	scoreP1 = "scores-small_0"+(game_ctxt[0].score);
	scoreP2 = "scores-small_0"+(game_ctxt[1].score);
	scoreP3 = "scores-small_0"+(game_ctxt[2].score);
	scoreP4 = "scores-small_0"+(game_ctxt[3].score);

	$("#score1").attr("class",scoreP1);
	$("#score2").attr("class",scoreP2);
	$("#score3").attr("class",scoreP3);
	$("#score4").attr("class",scoreP4);

	// player one
	var htmlString = game_ctxt[0].picture;
	$("#player1 .photo").html(htmlString);
	htmlString = game_ctxt[0].name;
	$("#player1 .pheader1").html(htmlString);

	// player 2
	htmlString = game_ctxt[1].picture;
	$("#player2 .photo").html(htmlString);
	htmlString = game_ctxt[1].name;
	$("#player2 .pheader2").html(htmlString);

	// player 3
	htmlString = game_ctxt[2].picture;
	$("#player3 .photo").html(htmlString);
	htmlString = game_ctxt[2].name;
	$("#player3 .pfooter3").html(htmlString);

	// player 4
	htmlString = game_ctxt[3].picture;
	$("#player4 .photo").html(htmlString);
	htmlString = game_ctxt[3].name;
	$("#player4 .pfooter4").html(htmlString);

    });

    subscription.callback(function () {
      console.log('Subscription admin is now active!');
    });
    subscription.errback(function (error) {
      alert(error.game_ctxt);
    });
  },

  /**
   * Update score.
   *
   * @param[in] -
   */
  updateScore: function (game_ctxt) {

    if ((game_ctxt.score >= 0) && (game_ctxt.score <= 10)) {

      var playerX = "#player" + game_ctxt.position;
      var scoreX = "#scorep" + game_ctxt.position;
      var htmlString = "";

      htmlString = '<p>' + game_ctxt.score + '</p>';
      $(scoreX).html(htmlString);

      $(playerX).attr("data-score", game_ctxt.score);
      $(playerX).attr("data-position", game_ctxt.position);
      $(playerX).attr("data-name", game_ctxt.first_name);
      $(playerX).attr("data-picture", game_ctxt.picture);

    }

    var s1 = $('[data-position="1"]').attr("data-score");
    var s2 = $('[data-position="2"]').attr("data-score");
    var s3 = $('[data-position="3"]').attr("data-score");
    var s4 = $('[data-position="4"]').attr("data-score");

    if (typeof s1 === 'undefined') {
      s1 = 0;
    }
    if (typeof s2 === 'undefined') {
      s2 = 0;
    }
    if (typeof s3 === 'undefined') {
      s3 = 0;
    }
    if (typeof s4 === 'undefined') {
      s4 = 0;
    }

    babyAdmin.GameCtxt.score_t1 = parseInt(s1) + parseInt(s2);
    babyAdmin.GameCtxt.score_t2 = parseInt(s3) + parseInt(s4);

    htmlString = '<p>' + babyAdmin.GameCtxt.score_t1 + '</p>';
    $("#scoret1").html(htmlString);
    htmlString = '<p>' + babyAdmin.GameCtxt.score_t2 + '</p>';
    $("#scoret2").html(htmlString);
  }
};