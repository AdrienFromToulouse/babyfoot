var client = io.connect("http://livegameup.asiance-dev.com");

var room = "index";

client.on('connect', function() {
  // Connected, let's sign-up for to receive messages for this room
  client.emit('room', room);
});

client.on('message', function(message) {

   var score_t1 = parseInt(message[0].score) + parseInt(message[1].score);
   var score_t2 = parseInt(message[2].score) + parseInt(message[3].score);

   var newclass1 = "scores-big_0"+score_t1;
   var newclass2 = "scores-big_0"+score_t2;

   $("#score_team1").attr("class",newclass1);
   $("#score_team2").attr("class",newclass2);

   scoreP1 = "scores-small_0"+(message[0].score);
   scoreP2 = "scores-small_0"+(message[1].score);
   scoreP3 = "scores-small_0"+(message[2].score);
   scoreP4 = "scores-small_0"+(message[3].score);

   $("#score1").attr("class",scoreP1);
   $("#score2").attr("class",scoreP2);
   $("#score3").attr("class",scoreP3);
   $("#score4").attr("class",scoreP4);

   // player one
   var htmlString = message[0].picture;
   $("#player1 .photo").html(htmlString);
   htmlString = message[0].name;
   $("#player1 .pheader1").html(htmlString);

   // player 2
   htmlString = message[1].picture;
   $("#player2 .photo").html(htmlString);
   htmlString = message[1].name;
   $("#player2 .pheader2").html(htmlString);

   // player 3
   htmlString = message[2].picture;
   $("#player3 .photo").html(htmlString);
   htmlString = message[2].name;
   $("#player3 .pfooter3").html(htmlString);

   // player 4
   htmlString = message[3].picture;
   $("#player4 .photo").html(htmlString);
   htmlString = message[3].name;
   $("#player4 .pfooter4").html(htmlString);

});