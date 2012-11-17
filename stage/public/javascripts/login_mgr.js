/**
 * This module manages the player's page.
 *
 */



/**
 * ICD
 */
var player_to_controller = {

    "started" : "",
    "cmd" : "",
    "change_team1": "", //count the nbrof changes in the team during a game
    "change_team2": "",
    //p1a p2a p3a p4a p1d p2d p3d p4d
    "score" :    [0, 0, 0, 0, 0, 0, 0, 0],
    "gamelle" :  [0, 0, 0, 0, 0, 0, 0, 0],
    "cendrier" : [0, 0, 0, 0, 0, 0, 0, 0],
    "pissette" : [0, 0, 0, 0, 0, 0, 0, 0],
    "reprise" :  [0, 0, 0, 0, 0, 0, 0, 0],
    "player" :   [{"imageP1": "", 
    		   "firstnameP1": ""},
    		  {"imageP2": "", 
    		   "firstnameP2": ""},
    		  {"imageP3": "", 
    		   "firstnameP3": ""},
    		  {"imageP4": "", 
    		   "firstnameP4": ""}]
};




/* client instance */
var client = new Faye.Client('/faye');


/**
 * Publish to /contoller channel.
 *
 * @param[in] - buffer_out: buffer to send.
 */
function login_send(buffer_out){

    var publication = client.publish('/controller', buffer_out);

    publication.callback(function() {
	console.log('Message received by server!');
    });

    publication.errback(function(error) {
	console.log('There was a problem: ' + error.message);
    });
}


/**
 * Get the current URL parameters (one by one).
 *
 * @param[in] - name: parameter name.
 */
function getURLParameter(name) {
    return decodeURI(
	(RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
}

/**
 * Send player data to /controller to be saved and post on FB wall.
 *
 * @param[in] - response: facebook response.
 */
function savePlayerNPost(response){

    FB.api('/me', function(response) {

	var position = getURLParameter('p');
	var babyId  = getURLParameter('b');

    	var player = {
    	    "fb_id": response.id,
    	    "name": response.name,
    	    "gender": response.gender,
    	    "first_name": response.first_name,
    	    "last_name": response.last_name,
    	    "locale": response.locale,
    	    "link": response.link,
    	    "picture": "https://graph.facebook.com/" + response.id + "/picture",
    	    "email": response.email,
    	    "position": position,
    	    "babyId": babyId
    	};

	login_send(player);

	var subscription = client.subscribe('/player/'+position+'/baby/'+babyId, function(message) {

	    console.log(message);

	});
	subscription.callback(function() {
	    console.log('Subscription is now active!');
	});

	subscription.errback(function(error) {
	    alert(error.message);
	});

	var params = {};
	params['message'] = 'I am playing Babyfoot right NOW! Watch me live on LiveGameUp! channel number: '+babyId;
	params['name'] = "LiveGameUp!";

	if(response.gender == "male"){

	    params['description'] = 'Watch '+response.first_name+' playing Babyfoot! Go ahead and support him!';
	}
	else if(response.gender == "female"){

	    params['description'] = 'Watch '+response.first_name+' playing Babyfoot! Go ahead and support her!';
	}
	else{
	    params['description'] = 'Watch '+response.first_name+' playing Babyfoot! Go ahead and support him!';
	}
	params['link'] = 'http://livegameup.asiance-dev.com:3100/';
	params['picture'] = 'http://livegameup.asiance-dev.com:3100/images/asiance.jpg';
	params['caption'] = 'Watch me live playing Babyfoot!!';

	// FB.api('/me/feed', 'post', params, function(response) {

    	//     if (!response || response.error) { 

    	// 	var errorID = new RegExp("#506");
		
    	// 	if(errorID.exec(response.error.message) == "#506"){
    	// 	}
    	//     } else { 
    	//     } 
	// });
    });
}


window.fbAsyncInit = function() {
    
    FB.init({
	appId      : '103759093066773',
	status     : true, // check login status
	cookie     : true, // enable cookies to allow the server to access the session
	xfbml      : true  // parse XFBML
    });

    /* If the user is already connected */
    FB.Event.subscribe('auth.authResponseChange', function(response) {

    	if(response.status == "connected"){

	    $("#logbut").remove();
	    // $('.logbutton').append("<h2>GO TO PLAY!!</h2>");


	    $('.logbutton').css('left', '218px');
	    $('.logbutton').css('bottom', '271px');

	    $('.logbutton').append("<img id='hf' src='../images/hf.png' alt='have_fun''>");



	    savePlayerNPost(response);
	    
    	} else if (response.status === 'not_authorized') {
    	    // the user is logged in to Facebook, 
    	    // but has not authenticated my app
    	} else {
    	    // the user isn't logged in to Facebook.
    	}
    });	
};



function fb_login(){

    FB.login(function(response) {
    	if (response.authResponse) {
	    // savePlayerNPost(response);
    	}else{
    	    //User cancelled login or did not fully authorize.
    	}
    }, {scope: 'email,user_checkins,publish_stream'});
}



// Load the FB SDK Asynchronously
(function(d){
    var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement('script'); js.id = id; js.async = true;
    js.src = "//connect.facebook.net/en_US/all.js";
    ref.parentNode.insertBefore(js, ref);
}(document));


$(document).ready(function() {

    $("#logbut").click(function() {
	fb_login();
    });
});
