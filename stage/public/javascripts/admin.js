var babyAdmin = {

    MyGameCtxt: {

	"babyId" : "",
	"position" : "",
	"ready" : "",
	"score" : "",
	"picture" : "",
	"name" : "",
	"partner_position" : ""
    },

    /**
     * Get the current URL parameters (one by one).
     *
     * @param[in] - name: parameter name.
     */
    getURLParameter: function (name) {
	return decodeURI(
	    (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
	);
    },

    /**
     *
     *	
     */
    init_connection : function()
    {
	var client = new Faye.Client('/faye');

	return client;
    },


    /**
     * Init the player (me) context (picture, name)...
     *	
     */
    init_ctxt : function(client)
    {
	var babyId = this.getURLParameter("babyId");
	var position = this.getURLParameter("position");
	var fb_id = this.getURLParameter("fbId");

	var datareq = {"babyId": babyId, 
		       "position": position,
		       "fb_id": fb_id };

	datareq = JSON.stringify(datareq);

	$.ajax({
	    url: "/player/getme",
	    type: "POST",
	    dataType: "json",
	    data: datareq,
	    contentType: "application/json",
	    cache: false,
	    timeout: 5000,
	    complete: function() {
	    },
	    success: function(me) {

		var htmlString = "";

		console.log(me);

		htmlString = '<img src="'+me.personal.picture+'">';
		$("#me .photo").html(htmlString);
		htmlString = '<span>'+me.personal.first_name+'</span>';
		$("#me .pfooter").html(htmlString);	

		$("#myscore").html('0');	

		babyAdmin.MyGameCtxt.position = me.position;
		babyAdmin.MyGameCtxt.babyId = me.babyId;
		babyAdmin.MyGameCtxt.score = me.stats.score;
		babyAdmin.MyGameCtxt.picture = me.personal.picture;
		babyAdmin.MyGameCtxt.name = me.personal.first_name;

		babyAdmin.WhoIsMyPartner(me.position);

		/* send my profile to the other players */
		babyAdmin.send(client, babyAdmin.MyGameCtxt);
	    },
	    error: function() {
		console.log("error");

	    },
	});
    },

    /**
     * Sends to the controller.
     *
     * @param[in] - buffer_out: data to send.
     * @param[in] - client: instance of client.
     */
    send : function(client, buffer_out)
    {
	var publication = client.publish('/controller', buffer_out);

	publication.callback(function() {
	    console.log('Message received by server!');
	});

	publication.errback(function(error) {
	    console.log('There was a problem: ' + error.message);
	});
    },

    /**
     * Creates a channel to get info of the players other than me.
     *
     * @param[in] - client: instance of client.
     */
    subscript : function(client)
    {
	var babyId = this.getURLParameter("babyId");
	var position = this.getURLParameter("position");

	var subscription = client.subscribe('/player/'+position+'/baby/'+babyId, function(game_ctxt) {

	    console.log(game_ctxt);

	    /* if the player is my partner */
	    if( game_ctxt.position == babyAdmin.MyGameCtxt.partner_position ){

		console.log("is my partner");

		babyAdmin.updateMyPartner(game_ctxt);
	    }
	    /* this player is not my partner and its not even me*/
	    else if(game_ctxt.position != babyAdmin.MyGameCtxt.position){
 
		var htmlString = "";

		switch(eval(game_ctxt.position))
		{
		case 1:
		console.log("is not my partner pos1");

		    htmlString = '<img src="'+game_ctxt.picture+'">';
		    $("#adv1 .photo").html(htmlString);
		    htmlString = '<span>'+game_ctxt.name+'</span>';
		    $("#adv1 .pfooter").html(htmlString);	
		    /*TODO: update score also*/
		    break;
		case 2:
		console.log("is not my partner pos2");


		    htmlString = '<img src="'+game_ctxt.picture+'">';
		    $("#adv2 .photo").html(htmlString);
		    htmlString = '<span>'+game_ctxt.name+'</span>';
		    $("#adv2 .pfooter").html(htmlString);
		    break;
		case 3:

		console.log("is not my partner pos3");

		    htmlString = '<img src="'+game_ctxt.picture+'">';
		    $("#adv1 .photo").html(htmlString);
		    htmlString = '<span>'+game_ctxt.name+'</span>';
		    $("#adv1 .pfooter").html(htmlString);
		    break;
		case 4:
		console.log("is not my partner pos4");


		    htmlString = '<img src="'+game_ctxt.picture+'">';
		    $("#adv2 .photo").html(htmlString);
		    htmlString = '<span>'+game_ctxt.name+'</span>';
		    $("#adv2 .pfooter").html(htmlString);
		    break;
		default:
		    console.log("default");
		}
	    }
	});

	subscription.callback(function() {
	    console.log('Subscription admin is now active!');
	});

	subscription.errback(function(error) {
	    alert(error.message);
	});
    },

    /**
     * Update score.
     *
     * @param[in] - 
     */
    updateScore : function(gameCtxt){
	
	var score_t1 = gameCtxt.score;
	// var score_t2 = game_ctxt.score[P3_ATTACKER] + game_ctxt.score[P3_DEFENSER] + game_ctxt.score[P4_ATTACKER] + game_ctxt.score[P4_DEFENSER];

	// var newclass1 = "scores-big_0"+score_t1;
	// var newclass2 = "scores-big_0"+score_t2;

	// $("#scoreTeam1Score").attr("class",newclass1);
	// $("#scoreTeam2Score").attr("class",newclass2);

	// var scoreP1 = "scores-small_0"+(game_ctxt.score[P1_ATTACKER] + game_ctxt.score[P1_DEFENSER]);
	// var scoreP2 = "scores-small_0"+(game_ctxt.score[P2_ATTACKER] + game_ctxt.score[P2_DEFENSER]);
	// var scoreP3 = "scores-small_0"+(game_ctxt.score[P3_ATTACKER] + game_ctxt.score[P3_DEFENSER]);
	// var scoreP4 = "scores-small_0"+(game_ctxt.score[P4_ATTACKER] + game_ctxt.score[P4_DEFENSER]);

	// $("#scorePlayer1").attr("class",scoreP1);
	// $("#scorePlayer2").attr("class",scoreP2);
	// $("#scorePlayer3").attr("class",scoreP3);
	// $("#scorePlayer4").attr("class",scoreP4);
    },


    /**
     * Update my partner.
     *
     * @param[in] - 
     */
    updateMyPartner : function(myPartner)
    {
	var babyId = this.getURLParameter("babyId");
	var position = this.getURLParameter("position");
	
  	var htmlString = '<img src="'+myPartner.picture+'">';
	$("#myco .photo").html(htmlString);
	htmlString = '<span>'+myPartner.name+'</span>';
	$("#myco .pfooter").html(htmlString);
	/*TODO: update score also*/

    },


    /**
     * Set the position of my partner.
     *
     * @param[in] - 
     */
    WhoIsMyPartner : function(myPosition)
    {
	switch(eval(myPosition))
	{
	case 1:
 	    babyAdmin.MyGameCtxt.partner_position = 2;
	    break;
	case 2:
	    babyAdmin.MyGameCtxt.partner_position = 1;
	    break;
	case 3:
	    babyAdmin.MyGameCtxt.partner_position = 4;
	    break; 
	case 4: 
	    babyAdmin.MyGameCtxt.partner_position = 3;
	    break;
	default:
	    console.log("default");
	}
    }
    

};