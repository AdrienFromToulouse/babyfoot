var P1_ATTACKER = 0;
var P2_ATTACKER = 1;
var P3_ATTACKER = 2;
var P4_ATTACKER = 3; 

var P1_DEFENSER = 4;
var P2_DEFENSER = 5;
var P3_DEFENSER = 6;
var P4_DEFENSER = 7; 




/**
 * Data model send to controller.
 */
var game_ctxt = {

    "cmd" : "",
    "babyId" : "",
    "position" : "",
    "player_ready" : "",
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




var me = babyAdmin.init_connection();

babyAdmin.subscript(me);

/* init  my profile */
babyAdmin.init_ctxt();


//babyAdmin.send(me,game_ctxt);








function admin_init(){

    game_ctxt.babyId = babyId;
    game_ctxt.position = position;

    game_ctxt.player_ready = false;

    game_ctxt.score[P1_ATTACKER] = 0;
    game_ctxt.score[P2_ATTACKER] = 0;
    game_ctxt.score[P3_ATTACKER] = 0;
    game_ctxt.score[P4_ATTACKER] = 0;

    game_ctxt.score[P1_DEFENSER] = 0;
    game_ctxt.score[P2_DEFENSER] = 0;
    game_ctxt.score[P3_DEFENSER] = 0;
    game_ctxt.score[P4_DEFENSER] = 0;
    /**/    
    game_ctxt.gamelle[P1_ATTACKER] = 0;
    game_ctxt.gamelle[P2_ATTACKER] = 0;
    game_ctxt.gamelle[P3_ATTACKER] = 0;
    game_ctxt.gamelle[P4_ATTACKER] = 0;

    game_ctxt.gamelle[P1_DEFENSER] = 0;
    game_ctxt.gamelle[P2_DEFENSER] = 0;
    game_ctxt.gamelle[P3_DEFENSER] = 0;
    game_ctxt.gamelle[P4_DEFENSER] = 0;
    /**/
    game_ctxt.cendrier[P1_ATTACKER] = 0;
    game_ctxt.cendrier[P2_ATTACKER] = 0;
    game_ctxt.cendrier[P3_ATTACKER] = 0;
    game_ctxt.cendrier[P4_ATTACKER] = 0;

    game_ctxt.cendrier[P1_DEFENSER] = 0;
    game_ctxt.cendrier[P2_DEFENSER] = 0;
    game_ctxt.cendrier[P3_DEFENSER] = 0;
    game_ctxt.cendrier[P4_DEFENSER] = 0;
    /**/
    game_ctxt.pissette[P1_ATTACKER] = 0;
    game_ctxt.pissette[P2_ATTACKER] = 0;
    game_ctxt.pissette[P3_ATTACKER] = 0;
    game_ctxt.pissette[P4_ATTACKER] = 0;

    game_ctxt.pissette[P1_DEFENSER] = 0;
    game_ctxt.pissette[P2_DEFENSER] = 0;
    game_ctxt.pissette[P3_DEFENSER] = 0;
    game_ctxt.pissette[P4_DEFENSER] = 0;
    /**/
    game_ctxt.reprise[P1_ATTACKER] = 0;
    game_ctxt.reprise[P2_ATTACKER] = 0;
    game_ctxt.reprise[P3_ATTACKER] = 0;
    game_ctxt.reprise[P4_ATTACKER] = 0;

    game_ctxt.reprise[P1_DEFENSER] = 0;
    game_ctxt.reprise[P2_DEFENSER] = 0;
    game_ctxt.reprise[P3_DEFENSER] = 0;
    game_ctxt.reprise[P4_DEFENSER] = 0;
    /**/
    game_ctxt.player.imageP1 = "";
    game_ctxt.player.imageP2 = "";
    game_ctxt.player.imageP3 = "";
    game_ctxt.player.imageP4 = "";
    /**/
    game_ctxt.player.firstnameP1 = "";
    game_ctxt.player.firstnameP2 = "";
    game_ctxt.player.firstnameP3 = "";
    game_ctxt.player.firstnameP4 = "";
    /**/
    game_ctxt.change_team1 = 0;
    game_ctxt.change_team2 = 0;
    /**/
    game_ctxt.cmd = "init";

    babyAdmin.send(client,game_ctxt);

    $('#p1plus').attr('disabled', 'disabled');
    $('#p2plus').attr('disabled', 'disabled');
    $('#p3plus').attr('disabled', 'disabled');
    $('#p4plus').attr('disabled', 'disabled');

    $('#p1minus').attr('disabled', 'disabled');
    $('#p2minus').attr('disabled', 'disabled');
    $('#p3minus').attr('disabled', 'disabled');
    $('#p4minus').attr('disabled', 'disabled');

    $('button#change-t1').attr('disabled', 'disabled');
    $('button#change-t2').attr('disabled', 'disabled');
}

function updateScore(game_ctxt){
    
    var score_t1 = game_ctxt.score[P1_ATTACKER] + game_ctxt.score[P1_DEFENSER] + game_ctxt.score[P2_ATTACKER] + game_ctxt.score[P2_DEFENSER];
    var score_t2 = game_ctxt.score[P3_ATTACKER] + game_ctxt.score[P3_DEFENSER] + game_ctxt.score[P4_ATTACKER] + game_ctxt.score[P4_DEFENSER];

    var newclass1 = "scores-big_0"+score_t1;
    var newclass2 = "scores-big_0"+score_t2;

    $("#scoreTeam1Score").attr("class",newclass1);
    $("#scoreTeam2Score").attr("class",newclass2);

    var scoreP1 = "scores-small_0"+(game_ctxt.score[P1_ATTACKER] + game_ctxt.score[P1_DEFENSER]);
    var scoreP2 = "scores-small_0"+(game_ctxt.score[P2_ATTACKER] + game_ctxt.score[P2_DEFENSER]);
    var scoreP3 = "scores-small_0"+(game_ctxt.score[P3_ATTACKER] + game_ctxt.score[P3_DEFENSER]);
    var scoreP4 = "scores-small_0"+(game_ctxt.score[P4_ATTACKER] + game_ctxt.score[P4_DEFENSER]);

    $("#scorePlayer1").attr("class",scoreP1);
    $("#scorePlayer2").attr("class",scoreP2);
    $("#scorePlayer3").attr("class",scoreP3);
    $("#scorePlayer4").attr("class",scoreP4);
}


/*
 * Init
 */
$().ready(function() {
    //  admin_init();
});

$(function() {
    /* PLUS */
    // $('#p1plus').on('click touchstart', function(e) {
    // 	if(game_ctxt.started != 0){
    // 	    /*NO CHANGE*/
    // 	    if(game_ctxt.change_team1 % 2 == 0){
    // 		e.preventDefault(); game_ctxt.score[P1_DEFENSER]++; game_ctxt.cmd = "updateScore";
    // 		admin_send(game_ctxt);
    // 		updateScore(game_ctxt);
    // 	    }else{
    // 		e.preventDefault(); game_ctxt.score[P1_ATTACKER]++; game_ctxt.cmd = "updateScore";
    // 		admin_send(game_ctxt);
    // 		updateScore(game_ctxt);
    // 	    }
    // 	}
    // });
    // $('#p2plus').on('click touchstart', function(e) {
    // 	if(game_ctxt.started != 0){
    // 	    if(game_ctxt.change_team1%2 == 0){
    // 		e.preventDefault(); game_ctxt.score[P2_ATTACKER]++; game_ctxt.cmd = "updateScore";
    // 		admin_send(game_ctxt);
    // 		updateScore(game_ctxt);
    // 	    }else{
    // 		e.preventDefault(); game_ctxt.score[P2_DEFENSER]++; game_ctxt.cmd = "updateScore";
    // 		admin_send(game_ctxt);
    // 		updateScore(game_ctxt);
    // 	    }
    // 	}
    // });
    // $('#p3plus').on('click touchstart', function(e) {
    // 	if(game_ctxt.started != 0){
    // 	    if(game_ctxt.change_team2%2 == 0){
    // 		e.preventDefault(); game_ctxt.score[P3_ATTACKER]++; game_ctxt.cmd = "updateScore";
    // 		admin_send(game_ctxt);
    // 		updateScore(game_ctxt);
    // 	    }else{
    // 		e.preventDefault(); game_ctxt.score[P3_DEFENSER]++; game_ctxt.cmd = "updateScore";
    // 		admin_send(game_ctxt);
    // 		updateScore(game_ctxt);
    // 	    }
    // 	}
    // });
    // $('#p4plus').on('click touchstart', function(e) {
    // 	if(game_ctxt.started != 0){
    // 	    if(game_ctxt.change_team2%2 == 0){
    // 		e.preventDefault(); game_ctxt.score[P4_DEFENSER]++; game_ctxt.cmd = "updateScore";
    // 		admin_send(game_ctxt);
    // 		updateScore(game_ctxt);
    // 	    }else{
    // 		e.preventDefault(); game_ctxt.score[P4_ATTACKER]++; game_ctxt.cmd = "updateScore";
    // 		admin_send(game_ctxt);
    // 		updateScore(game_ctxt);
    // 	    }
    // 	}
    // });

    // /* LESS */
    // $('#p1minus').on('click touchstart', function(e) {
    // 	if(game_ctxt.started != 0){
    // 	    e.preventDefault(); game_ctxt.score[P1_ATTACKER]--; game_ctxt.cmd = "updateScore";
    // 	    admin_send(game_ctxt);
    // 	    updateScore(game_ctxt);
    // 	}
    // });
    // $('#p2minus').on('click touchstart', function(e) {
    // 	if(game_ctxt.started != 0){
    // 	    e.preventDefault(); game_ctxt.score[P2_ATTACKER]--; game_ctxt.cmd = "updateScore";
    // 	    admin_send(game_ctxt);
    // 	    updateScore(game_ctxt);
    // 	}
    // });
    // $('#p3minus').on('click touchstart', function(e) {
    // 	if(game_ctxt.started != 0){
    // 	    e.preventDefault(); game_ctxt.score[P3_ATTACKER]--; game_ctxt.cmd = "updateScore";
    // 	    admin_send(game_ctxt);
    // 	    updateScore(game_ctxt);
    // 	}
    // });
    // $('#p4minus').on('click touchstart', function(e) {
    // 	if(game_ctxt.started != 0){
    // 	    e.preventDefault(); game_ctxt.score[P4_ATTACKER]--; game_ctxt.cmd = "updateScore";
    // 	    admin_send(game_ctxt);
    // 	    updateScore(game_ctxt);
    // 	}
    // });

    // /* CHANGE */
    // $('button#change-t1').click(function(e) {
    // 	if(game_ctxt.started != 0){
    // 	    e.preventDefault(); game_ctxt.change_team1++; game_ctxt.cmd = "changeTeam1";
    // 	    admin_send(game_ctxt);
    // 	}
    // });
    // $('button#change-t2').click(function(e) {
    // 	if(game_ctxt.started != 0){
    // 	    e.preventDefault(); game_ctxt.change_team2++; game_ctxt.cmd = "changeTeam2";
    // 	    admin_send(game_ctxt);
    // 	}
    // });

    // /* GAMELLE */
    // $('button#gamelle-t1p1').click(function(e) {
    // 	e.preventDefault(); game_ctxt.gamelle[0]++; game_ctxt.cmd = "updateGamelle";
    // 	admin_send(game_ctxt);
    // });
    // $('button#gamelle-t1p2').click(function(e) {
    // 	e.preventDefault(); game_ctxt.gamelle[1]++; game_ctxt.cmd = "updateGamelle";
    // 	admin_send(game_ctxt);
    // });
    // $('button#gamelle-t2p1').click(function(e) {
    // 	e.preventDefault(); game_ctxt.gamelle[2]++; game_ctxt.cmd = "updateGamelle";
    // 	admin_send(game_ctxt);
    // });
    // $('button#gamelle-t2p2').click(function(e) {
    // 	e.preventDefault(); game_ctxt.gamelle[3]++; game_ctxt.cmd = "updateGamelle";
    // 	admin_send(game_ctxt);
    // });

    // /* PISSETTE */
    // $('button#pissette-t1p1').click(function(e) {
    // 	e.preventDefault(); game_ctxt.pissette[0]++; game_ctxt.cmd = "updatePissette";
    // 	admin_send(game_ctxt);
    // });
    // $('button#pissette-t1p2').click(function(e) {
    // 	e.preventDefault(); game_ctxt.pissette[1]++; game_ctxt.cmd = "updatePissette";
    // 	admin_send(game_ctxt);
    // });
    // $('button#pissette-t2p1').click(function(e) {
    // 	e.preventDefault(); game_ctxt.pissette[2]++; game_ctxt.cmd = "updatePissette";
    // 	admin_send(game_ctxt);
    // });
    // $('button#pissette-t2p2').click(function(e) {
    // 	e.preventDefault(); game_ctxt.pissette[3]++; game_ctxt.cmd = "updatePissette";
    // 	admin_send(game_ctxt);
    // });

    $('#start').on('click touchstart', function(e) {

	e.preventDefault();

	if(game_ctxt.started == 0){
	    game_ctxt.started = 1;

	    $('#p1plus').removeAttr('disabled');
	    $('#p2plus').removeAttr('disabled');
	    $('#p3plus').removeAttr('disabled');
	    $('#p4plus').removeAttr('disabled');

	    $('#p1minus').removeAttr('disabled');
	    $('#p2minus').removeAttr('disabled');
	    $('#p3minus').removeAttr('disabled');
	    $('#p4minus').removeAttr('disabled');

	    $('button#change-t1').removeAttr('disabled');
	    $('button#change-t2').removeAttr('disabled');
	    
	    // player 1
  	    game_ctxt.player[0].imageP1 = $("#p1pic").html();
  	    game_ctxt.player[0].firstnameP1 = $("td#p1r2c1").html();	

	    // player 2
  	    game_ctxt.player[1].imageP2= $("#p2pic").html();
  	    game_ctxt.player[1].firstnameP2 = $("td#p2r2c2").html();

	    // player 3
  	    game_ctxt.player[2].imageP3 = $("#p3pic").html();
	    game_ctxt.player[2].firstnameP3 = $("td#p3r2c1").html();

	    // player 4
  	    game_ctxt.player[3].imageP4= $("#p4pic").html();
  	    game_ctxt.player[3].firstnameP4 = $("td#p4r2c2").html();

	    game_ctxt.cmd = "start";

//	    admin_send(game_ctxt);
	    babyAdmin.send(client,game_ctxt);


	    $("#start").attr("src","../images/btn_stop.png" );

	    alert("getting started");
	}
	else{
	    alert("getting stopped");

	    $("#start").attr("src","../images/btn_start.png" );

	    admin_init();
	    game_ctxt.cmd = "stop";

	    // admin_send(game_ctxt);
	    updateScore(game_ctxt);
	}
    });
});