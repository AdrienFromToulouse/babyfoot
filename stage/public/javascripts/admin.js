
var babyAdmin = {

    MyGameCtxt: {

	"babyId" : "",
	"position" : "",
	"ready" : "",
	"score" : "", 
	"picture" : "",
	"name" : "",
	"partner_position" : "",
	"score_t1": 0,
	"score_t2": 0
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
	
		babyAdmin.MyGameCtxt.position = me.position;
		babyAdmin.MyGameCtxt.babyId = me.babyId;
		babyAdmin.MyGameCtxt.score = me.stats.score;
		babyAdmin.MyGameCtxt.picture = me.personal.picture;
		babyAdmin.MyGameCtxt.name = me.personal.first_name;

		babyAdmin.WhoIsMyPartner(me.position);

		babyAdmin.updateScore(me);

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
		    htmlString = '<img src="'+game_ctxt.picture+'">';
		    $("#adv1 .photo").html(htmlString);
		    htmlString = '<span>'+game_ctxt.name+'</span>';
		    $("#adv1 .pfooter").html(htmlString);	
		    babyAdmin.updateScore(game_ctxt);

		    break;
		case 2:
		    htmlString = '<img src="'+game_ctxt.picture+'">';
		    $("#adv2 .photo").html(htmlString);
		    htmlString = '<span>'+game_ctxt.name+'</span>';
		    $("#adv2 .pfooter").html(htmlString);
		    babyAdmin.updateScore(game_ctxt);

		    break;
		case 3:
		    htmlString = '<img src="'+game_ctxt.picture+'">';
		    $("#adv1 .photo").html(htmlString);
		    htmlString = '<span>'+game_ctxt.name+'</span>';
		    $("#adv1 .pfooter").html(htmlString);
		    babyAdmin.updateScore(game_ctxt);

		    break;
		case 4:
		    htmlString = '<img src="'+game_ctxt.picture+'">';
		    $("#adv2 .photo").html(htmlString);
		    htmlString = '<span>'+game_ctxt.name+'</span>';
		    $("#adv2 .pfooter").html(htmlString);
		    babyAdmin.updateScore(game_ctxt);

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
    updateScore : function(game_ctxt){

	if(game_ctxt.score >= 0){

	    /* if it's actually me */
	    if(babyAdmin.MyGameCtxt.position == game_ctxt.position){

		var scoreMe = "scores-small_0"+(babyAdmin.MyGameCtxt.score);
		$("#myscore").attr("class",scoreMe);
		$("#myscore").attr("data-score",babyAdmin.MyGameCtxt.score);
		$("#myscore").attr("data-position",game_ctxt.position);

	    }
	    else if(babyAdmin.MyGameCtxt.partner_position == game_ctxt.position){

		var scoreCo = "scores-small_0"+(game_ctxt.score);
		$("#mycoscore").attr("class",scoreCo);
		$("#mycoscore").attr("data-score",game_ctxt.score);
		$("#mycoscore").attr("data-position",game_ctxt.position);
	    }
	    else{
		switch(eval(game_ctxt.position))
		{
		case 1:
		    var scoreP1 = "scores-small_0"+(game_ctxt.score);

		    $("#adv1score").attr("class",scoreP1);
		    $("#adv1score").attr("data-score",game_ctxt.score);
		    $("#adv1score").attr("data-position",game_ctxt.position);

		    break;
		case 2:
		    var scoreP2 = "scores-small_0"+(game_ctxt.score);

		    $("#adv2score").attr("class",scoreP2);
		    $("#adv2score").attr("data-score",game_ctxt.score);
		    $("#adv2score").attr("data-position",game_ctxt.position);
		    break;
		case 3:
		    var scoreP3 = "scores-small_0"+(game_ctxt.score);

		    $("#adv1score").attr("class",scoreP3);
		    $("#adv1score").attr("data-score",game_ctxt.score);
		    $("#adv1score").attr("data-position",game_ctxt.position);
		    break;
		case 4:
		    var scoreP4 = "scores-small_0"+(game_ctxt.score);

		    $("#adv2score").attr("class",scoreP4);
		    $("#adv2score").attr("data-score",game_ctxt.score);
		    $("#adv2score").attr("data-position",game_ctxt.position);
		    break;
		default:
		    console.log("default");
		}
	    }
	    
	    var s1 = document.getElementById("mycoscore").getAttribute('data-score');
	    var s2 = document.getElementById("adv1score").getAttribute('data-score');
	    var s3 = document.getElementById("adv2score").getAttribute('data-score');
	    var s4 = document.getElementById("myscore").getAttribute('data-score');

	    var s1 = $('[data-position="1"]').attr("data-score");
	    var s2 = $('[data-position="2"]').attr("data-score");
	    var s3 = $('[data-position="3"]').attr("data-score");
	    var s4 = $('[data-position="4"]').attr("data-score");

	    if(typeof s1 === 'undefined'){s1 = 0;}
	    if(typeof s2 === 'undefined'){s2 = 0;}
	    if(typeof s3 === 'undefined'){s3 = 0;}
	    if(typeof s4 === 'undefined'){s4 = 0;}

 	    babyAdmin.MyGameCtxt.score_t1 = parseInt(s1) + parseInt(s2);
	    babyAdmin.MyGameCtxt.score_t2 = parseInt(s3) + parseInt(s4);

	    var newclass1 = "scores-big_0"+babyAdmin.MyGameCtxt.score_t1;
	    $("#score_team1").attr("class",newclass1);
	    var newclass2 = "scores-big_0"+babyAdmin.MyGameCtxt.score_t2;
	    $("#score_team2").attr("class",newclass2);
	}
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
	babyAdmin.updateScore(myPartner);
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