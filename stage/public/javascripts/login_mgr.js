
var console;

if (!(!!console && !!console.log)) {
    console = {
	log: function() {}
    };
}


function getURLParameter(name) {
    return decodeURI(
	(RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
}


function savePlayerNPost(response){

    FB.api('/me', function(response) {

	var position = getURLParameter('p');
	var channel = 01; /* channel = [01 02 ... 12 13]*/

    	/*ENABLED WHEN THERE WILL BE MORE CHANNELS TO MANY DATA FOR THE NFC TAG AS IS*/
    	// var regex = /http\:\/\/baby-foot\.asiance-dev\.com:3100\/login\?position=(\w{1})\&channel=(\w{2})/;
    	// var url = document.URL;
    	// var position = document.URL.match(regex)[1];
    	// var channel = document.URL.match(regex)[2]; /* channel = [01 02 ... 12 13]*/

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
    	    "channel": channel,
    	};

    	player = JSON.stringify(player);
	

 	$.ajax({
    	    url: "/login",
    	    type: "POST",
    	    dataType: "json",
    	    data: player,
    	    contentType: "application/json",
    	    cache: false,
    	    timeout: 5000,
    	    complete: function() {
    	    },
    	    success: function(data) {
    	    },
    	    error: function() {
    	    },
    	});


    	$.ajax({
    	    url: "/logged_player",
    	    type: "POST",
    	    dataType: "json",
    	    data: player,
    	    contentType: "application/json",
    	    cache: false,
    	    timeout: 5000,
    	    complete: function() {
    	    },
    	    success: function(data) {
    	    },
    	    error: function() {
    	    },
    	});

	var params = {};
	params['message'] = 'I am playing Babyfoot right NOW! Watch me live on LiveGameUp!';
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

	FB.api('/me/feed', 'post', params, function(response) {

    	    if (!response || response.error) { 

    		var errorID = new RegExp("#506");
		
    		if(errorID.exec(response.error.message) == "#506"){
    		}
    	    } else { 
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
