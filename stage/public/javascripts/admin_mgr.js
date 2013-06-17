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

	    // babyAdmin.GameCtxt.position = babyAdmin.GameCtxt.position - 1;
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

	    // babyAdmin.GameCtxt.position = babyAdmin.GameCtxt.position - 1;
    	    babyAdmin.send(admin, babyAdmin.GameCtxt);

    	});
    });

});


var admin = babyAdmin.init_connection();

babyAdmin.subscript(admin);