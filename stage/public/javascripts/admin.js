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
		var playerX = "#player"+me.position;
		
		htmlString = '<img src="'+me.personal.picture+'">';
		$(playerX+" .photo").html(htmlString);
		htmlString = '<p>'+me.personal.first_name+'</p>';
		$(playerX+" .pname").html(htmlString);	

		$(playerX).addClass("joined");
	
		babyAdmin.MyGameCtxt.position = me.position;
		babyAdmin.MyGameCtxt.babyId = me.babyId;
		babyAdmin.MyGameCtxt.score = me.stats.score;
		babyAdmin.MyGameCtxt.picture = me.personal.picture;
		babyAdmin.MyGameCtxt.name = me.personal.first_name;
 

		htmlString = '<p>'+babyAdmin.MyGameCtxt.score+'</p>';
		$("#myscore").html(htmlString);

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
     * Creates my channel to get info of the other players.
     *
     * @param[in] - client: instance of client.
     */
    subscript : function(client)
    {
	var babyId = this.getURLParameter("babyId");
	var position = this.getURLParameter("position");

	var subscription = client.subscribe('/player/'+position+'/baby/'+babyId, function(game_ctxt) {

	    var playerX = "#player"+game_ctxt.position;
	    var htmlString = "";

	    htmlString = '<img src="'+game_ctxt.picture+'">';
	    $(playerX+" .photo").html(htmlString);
	    htmlString = '<p>'+game_ctxt.name+'</p>';
	    $(playerX+" .pname").html(htmlString);	
	    babyAdmin.updateScore(game_ctxt);

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

	if(  (game_ctxt.score >= 0) && (game_ctxt.score <= 10)  ){

	    var playerX = "#player"+game_ctxt.position;
	    var scoreX = "#scorep"+game_ctxt.position;
	    var htmlString = "";

	    htmlString = '<p>'+game_ctxt.score+'</p>';
	    $(scoreX).html(htmlString);

	    $(playerX).attr("data-score",game_ctxt.score);
	    $(playerX).attr("data-position",game_ctxt.position);

	}

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

	htmlString = '<p>'+babyAdmin.MyGameCtxt.score_t1+'</p>';
	$("#scoret1").html(htmlString);
	htmlString = '<p>'+babyAdmin.MyGameCtxt.score_t2+'</p>';
	$("#scoret2").html(htmlString);


    },
};