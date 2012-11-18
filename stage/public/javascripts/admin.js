var babyAdmin = {


    //    SEOUL : 4,

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
    init_ctxt : function()
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

		console.log(me);

		// var htmlString = "";

		// 	htmlString = '<img src="'+me.personal.picture+'">';
		// 	$("#mypic").html(htmlString);
		// 	htmlString = '<span>'+me.personal.first_name+'</span>';
		// 	$("#myname").html(htmlString);	
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
	var position = this. getURLParameter("position");
	
	var subscription = client.subscribe('/player/'+position+'/baby/'+babyId, function(game_ctxt) {

	    
	    // var htmlString = "";

	    // switch(eval(game_ctxt.position))
	    // {
	    // case 1:
	    // 	htmlString = '<img src="'+game_ctxt.picture+'">';
	    // 	$("#p1pic").html(htmlString);
	    // 	htmlString = '<span>'+game_ctxt.first_name+'</span>';
	    // 	$("#p1name").html(htmlString);	
	    // 	break;
	    // case 2:
	    // 	htmlString = '<img src="'+game_ctxt.picture+'">';
	    // 	$("#p2pic").html(htmlString);
	    // 	htmlString = '<span>'+game_ctxt.first_name+'</span>';
	    // 	$("#p2name").html(htmlString);
	    // 	break;
	    // case 3:
	    // 	htmlString = '<img src="'+game_ctxt.picture+'">';
	    // 	$("#p3pic").html(htmlString);
	    // 	htmlString = '<span>'+game_ctxt.first_name+'</span>';
	    // 	$("#p3name").html(htmlString);
	    // 	break;
	    // case 4:
	    // 	htmlString = '<img src="'+game_ctxt.picture+'">';
	    // 	$("#p4pic").html(htmlString);
	    // 	htmlString = '<span>'+game_ctxt.first_name+'</span>';
	    // 	$("#p4name").html(htmlString);
	    // 	break;
	    // default:
	    // 	console.log("default");
	    // }
	});

	subscription.callback(function() {
	    console.log('Subscription admin is now active!');
	});

	subscription.errback(function(error) {
	    alert(error.message);
	});
    },

};