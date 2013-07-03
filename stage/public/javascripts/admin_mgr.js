/*
 * Init
 */
$().ready(function() {

    $(function() {
    	$('.plus').on('click touchstart', function(e) {
    	    e.preventDefault(); 

	    babyAdmin.GameCtxt.position = $(this).attr('data-position');

            var playerX = "#player" + babyAdmin.GameCtxt.position;
	    babyAdmin.GameCtxt.score = $(playerX).attr("data-score");
	    babyAdmin.GameCtxt.score++

	    $(playerX).attr("data-score", babyAdmin.GameCtxt.score);
            babyAdmin.GameCtxt.picture = $(playerX).attr("data-picture");
            babyAdmin.GameCtxt.first_name = $(playerX).attr("data-name");

    	    babyAdmin.updateScore(babyAdmin.GameCtxt);
	  	    babyAdmin.send(admin, babyAdmin.GameCtxt);

       	});
	
    	$('.minus').on('click touchstart', function(e) {
    	    e.preventDefault(); 

	    babyAdmin.GameCtxt.position = $(this).attr('data-position');

            var playerX = "#player" + babyAdmin.GameCtxt.position;
	    babyAdmin.GameCtxt.score = $(playerX).attr("data-score");
	    babyAdmin.GameCtxt.score--

	    $(playerX).attr("data-score", babyAdmin.GameCtxt.score);
            babyAdmin.GameCtxt.picture = $(playerX).attr("data-picture");
            babyAdmin.GameCtxt.first_name = $(playerX).attr("data-name");

    	    babyAdmin.updateScore(babyAdmin.GameCtxt);
    	    babyAdmin.send(admin, babyAdmin.GameCtxt);

    	});

      $('#start').on('click touchstart', function(e) {

        e.preventDefault();

        if(babyAdmin.GameCtxt.started == 0){
          babyAdmin.GameCtxt.started = 1;

          $.ajax({
            url: "/player/setReady",
            type: "POST",
            cache: false,
            timeout: 5000,
            complete: function() {
            },
            success: function(data) {
            }
          });

          $("#start").attr("src","../images/btn_stop.png" );
        }
        else{

          $("#start").attr("src","../images/btn_start.png" );
          babyAdmin.GameCtxt.started = 0;

          var htmlString = '<p>0</p>';
          $("#scoret1").html(htmlString);
          $("#scoret2").html(htmlString);

          var i = 0;
          for(i = 1 ; i <= 4 ; i++){

            var playerX = "#player"+i;
            var scorep = "#scorep"+i;

            htmlString = '<p>0</p>';

            $(scorep).html(htmlString);
            htmlString = '<p></p>';

            htmlString = '<p></p>';
            $(playerX + " .pname").html(htmlString);

            htmlString = '<img src="">';
            $(playerX + " .photo").html(htmlString);
          }


          var datareq = {"babyId": 1};
          datareq = JSON.stringify(datareq);

          $.ajax({
            url: "/player/setScores",
            type: "POST",
            contentType: "application/json",
            data: datareq,
            cache: false,
            timeout: 5000,
            complete: function() {
            },
            success: function(data) {
            }
          });
        }
      });
    });
});


var admin = babyAdmin.init_connection();
babyAdmin.GameCtxt.started = 0;
babyAdmin.subscript(admin);