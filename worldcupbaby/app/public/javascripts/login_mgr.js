var babyLogin = {

  accessToken: "",

  position: "",

  isFirstSession: true,

  /**
   * Start validation after FB login.
   *
   */
  readyOrNot: function () {
    $("#logbut").remove();
    $('.logbutton').append("<div class='start'></div>");

    $('.start').on( "click touchstart", function() {

      var posting = $.post("/login/isready/"+babyLogin.position);
      posting.done(function(data) {
        babyLogin.getGuest();
      });
    })
  },

  /**
   * Get the guest.
   *
   */
  getGuest: function () {

    var posting = $.post("/login/guest");
    posting.done(function(data) {
      $(".start").remove();
      $('.logbutton').append("<img id='hf' src='"+data.personal.picture+"' alt='have_fun'><div><p  class='gluck'>Good luck!</p><p class='guestname'>"+data.personal.name+"</p></div>");
 
      babyLogin.isFirstSession = false;

    });
  },

  /**
   * Send the player's data.
   *
   * @param[in] - buffer_out: buffer to send.
   */
  register: function(buffer_out) {

    buffer_out = JSON.stringify(buffer_out);
    $.ajax({
      url: "/login",
      type: "POST",
      dataType: "json",
      data: buffer_out,
      contentType: "application/json",
      cache: false,
      timeout: 5000,
      done: function(data) {
      }
    });
  },

  /**
   * Get the current URL parameters (one by one).
   *
   * @param[in] - name: parameter name.
   */
  getURLParameter: function(name) {
    return decodeURI(
      (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]
    );
  },

  /**
   *
   */
  fbLogin: function() {
    FB.login(function (response){}, {scope: 'email,publish_stream,publish_actions'});
  },

  /**
   * Send player data to /controller to be saved and post on FB wall.
   *
   * @param[in] - response: facebook response.
   */
  savePlayerNPost: function(response) {

    FB.api('/me', function (response) {

      babyLogin.position = babyLogin.getURLParameter('p');
      var babyId = babyLogin.getURLParameter('b');

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
        "position": babyLogin.position,
        "babyId": babyId,
        "accessToken": babyLogin.accessToken 
      };

      /* to be saved in database */
      babyLogin.register(player);

      var params = {};
      params['message'] = 'I am playing Babyfoot right now at Asiance! Watch me live on LiveGameUp!';
      params['name'] = "LiveGameUp!";

      if (response.gender == "male") {

        params['description'] = 'Watch ' + response.first_name + ' playing Babyfoot! Go ahead and support him!';
      }
      else if (response.gender == "female") {

        params['description'] = 'Watch ' + response.first_name + ' playing Babyfoot! Go ahead and support her!';
      }
      else {
        params['description'] = 'Watch ' + response.first_name + ' playing Babyfoot! Go ahead and support him!';
      }
      params['link'] = 'http://livegameup.asiance.com:3300/me/'+response.id;
      params['picture'] = 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-ash3/s160x160/554754_10150783535441532_406615437_a.jpg';
      params['caption'] = 'Watch me live playing Babyfoot!!';

      FB.api('/me/feed', 'post', params, function (response) {

        if (!response || response.error) {

          var errorID = new RegExp("#506");
          alert("Sorry, you can't access the game. Try again later.");
          if (errorID.exec(response.error.message) == "#506") {
          }
        } else {
          // /* thanks to the facebook delay the player has enough time to be saved before the redirect*/
          // window.location = "/admin?babyId=" + babyId + "&position=" + babyLogin.position + "&fbId=" + response.id;
        }
      });
    });
  }
}


window.fbAsyncInit = function () {

  FB.init({
    appId: '103759093066773',
    status: true,
    cookie: true,
    xfbml: true
  });

  FB.Event.subscribe('auth.authResponseChange', function (response) {
    babyLogin.accessToken = response.authResponse.accessToken;

    if (response.status == "connected") {
      if ( babyLogin.isFirstSession === true ){
        babyLogin.savePlayerNPost(response);
        babyLogin.readyOrNot();
      }
    }
  });
};

// Load the FB SDK Asynchronously
(function (d) {
  var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
  if (d.getElementById(id)) {
    return;
  }
  js = d.createElement('script');
  js.id = id;
  js.async = true;
  js.src = "//connect.facebook.net/en_US/all.js";
  ref.parentNode.insertBefore(js, ref);
}(document));


$(document).ready(function () {

  $("#logbut").click(function () {
    babyLogin.fbLogin();
  });
});