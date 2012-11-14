/**
 * Define
 */
var P1_ATTACKER = 0;
var P2_ATTACKER = 1;
var P3_ATTACKER = 2;
var P4_ATTACKER = 3; 

var P1_DEFENSER = 4;
var P2_DEFENSER = 5;
var P3_DEFENSER = 6;
var P4_DEFENSER = 7; 


var client = new Faye.Client('/faye');

function index_send(buffer_out){

    var publication = client.publish('/admin', buffer_out);

    publication.callback(function() {
	console.log('Message received by server!');
    });

    publication.errback(function(error) {
	console.log('There was a problem: ' + error.message);
    });
}



var subscription = client.subscribe('/channel_index', function(message) {

    score_t1 = message.score[P1_ATTACKER] + message.score[P1_DEFENSER] + message.score[P2_ATTACKER] + message.score[P2_DEFENSER];
    score_t2 = message.score[P3_ATTACKER] + message.score[P3_DEFENSER] + message.score[P4_ATTACKER] + message.score[P4_DEFENSER];
    
    var newclass1 = "scores-big_0"+score_t1;
    var newclass2 = "scores-big_0"+score_t2;

    $("#score_team1").attr("class",newclass1);
    $("#score_team2").attr("class",newclass2);

    scoreP1 = "scores-small_0"+(message.score[P1_ATTACKER] + message.score[P1_DEFENSER]);
    scoreP2 = "scores-small_0"+(message.score[P2_ATTACKER] + message.score[P2_DEFENSER]);
    scoreP3 = "scores-small_0"+(message.score[P3_ATTACKER] + message.score[P3_DEFENSER]);
    scoreP4 = "scores-small_0"+(message.score[P4_ATTACKER] + message.score[P4_DEFENSER]);


    $("#score1").attr("class",scoreP1);
    $("#score2").attr("class",scoreP2);
    $("#score3").attr("class",scoreP3);
    $("#score4").attr("class",scoreP4);


    // player one
    var htmlString = message.player[0].imageP1;
    $("#player1 .photo").html(htmlString);
    htmlString = message.player[0].firstnameP1;
    $("#player1 .pheader1").html(htmlString);	
 
    // player 2
    htmlString = message.player[1].imageP2;
    $("#player2 .photo").html(htmlString);
    htmlString = message.player[1].firstnameP2;
    $("#player2 .pheader2").html(htmlString);

    // player 3
    htmlString = message.player[2].imageP3;
    $("#player3 .photo").html(htmlString);
    htmlString = message.player[2].firstnameP3;
    $("#player3 .pfooter3").html(htmlString);

    // player 4
    htmlString = message.player[3].imageP4;
    $("#player4 .photo").html(htmlString);
    htmlString = message.player[3].firstnameP4;
    $("#player4 .pfooter4").html(htmlString);

});

subscription.callback(function() {

    console.log('Subscription is now active!');

    index_send({newsubscription: 1});
});

subscription.errback(function(error) {
    alert(error.message);
});