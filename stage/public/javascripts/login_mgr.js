/**
 * This module manages the player's page.
 *
 */
 
/**
 * New client instance.
 */
var client = new Faye.Client('/faye');


/**
 * Publish to /contoller channel.
 *
 * @param[in] - buffer_out: buffer to send.
 */
function login_send(buffer_out){

    var publication = client.publish('/controller/logplayer', buffer_out);

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


	/* to be saved in database */
	login_send(player);

	
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
	params['link'] = 'http://livegameup.asiance-dev.com:3300/';
	params['picture'] = 'http://livegameup.asiance-dev.com:3300/images/asiance.jpg';
	params['caption'] = 'Watch me live playing Babyfoot!!';

 	FB.api('/me/feed', 'post', params, function(response) {

    	    if (!response || response.error) { 

    		var errorID = new RegExp("#506");
		alert("Sorry, you can't access the game. Try again later.");
		
    		if(errorID.exec(response.error.message) == "#506"){
    		}
    	    } else {
		/* thanks to the facebook delay the player has enough time to be saved before the redirect*/
	 	window.location = "/admin?babyId="+babyId+"&position="+position+"&fbId="+response.id;

    	    } 
	});
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

	    savePlayerNPost(response);

	    $("#logbut").remove();
	 
	    $('.logbutton').css('left', '215px');
	    $('.logbutton').css('bottom', '265px');


	    var position = getURLParameter('p');
	    var babyId  = getURLParameter('b');

	    $('.logbutton').append("<a href='/admin?babyId="+babyId+"&position="+position+"'><img id='hf' src='../images/hf.png' alt='have_fun'></a>");

	    
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
    }, {scope: 'email,publish_stream'});
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
