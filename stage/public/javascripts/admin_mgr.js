// var P1_ATTACKER = 0;
// var P2_ATTACKER = 1;
// var P3_ATTACKER = 2;
// var P4_ATTACKER = 3; 

// var P1_DEFENSER = 4;
// var P2_DEFENSER = 5;
// var P3_DEFENSER = 6;
// var P4_DEFENSER = 7; 




/**
 * Data model send to controller.
 */
// var game_ctxt = {

//     "cmd" : "",
//     "babyId" : "",
//     "position" : "",
//     "player_ready" : "",
//     "change_team1": "", //count the nbrof changes in the team during a game
//     "change_team2": "",
//     //p1a p2a p3a p4a p1d p2d p3d p4d
//     "score" :    [0, 0, 0, 0, 0, 0, 0, 0],
//     "gamelle" :  [0, 0, 0, 0, 0, 0, 0, 0],
//     "cendrier" : [0, 0, 0, 0, 0, 0, 0, 0],
//     "pissette" : [0, 0, 0, 0, 0, 0, 0, 0],
//     "reprise" :  [0, 0, 0, 0, 0, 0, 0, 0],
//     "player" :   [{"imageP1": "", 
//     		   "firstnameP1": ""},
//     		  {"imageP2": "", 
//     		   "firstnameP2": ""},
//     		  {"imageP3": "", 
//     		   "firstnameP3": ""},
//     		  {"imageP4": "", 
//     		   "firstnameP4": ""}]
// };




me = babyAdmin.init_connection();

babyAdmin.subscript(me);

/* init my profile */
babyAdmin.init_ctxt(me);





function updateScore(game_ctxt){
    
    var score_t1 = game_ctxt.score;
    // var score_t2 = game_ctxt.score[P3_ATTACKER] + game_ctxt.score[P3_DEFENSER] + game_ctxt.score[P4_ATTACKER] + game_ctxt.score[P4_DEFENSER];

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
    $('#plus').on('click touchstart', function(e) {
    	e.preventDefault(); babyAdmin.MyGameCtxt.score++;
    	babyAdmin.send(me, babyAdmin.MyGameCtxt);
	updateScore(babyAdmin.MyGameCtxt);
    });
    
    /* LESS */
    $('#minus').on('click touchstart', function(e) {
    	e.preventDefault(); babyAdmin.MyGameCtxt.score--;
    	babyAdmin.send(me, babyAdmin.MyGameCtxt);
	updateScore(babyAdmin.MyGameCtxt);
    });
});