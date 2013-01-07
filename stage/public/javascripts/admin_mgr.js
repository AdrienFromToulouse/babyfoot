/*
 * Init
 */
$().ready(function() {

    $(function() {
	$('#plus').on('click touchstart', function(e) {
    	    e.preventDefault(); babyAdmin.MyGameCtxt.score++;
    	    babyAdmin.send(me, babyAdmin.MyGameCtxt);
	    babyAdmin.updateScore(babyAdmin.MyGameCtxt);
	});
	
	$('#minus').on('click touchstart', function(e) {
    	    e.preventDefault(); babyAdmin.MyGameCtxt.score--;
    	    babyAdmin.send(me, babyAdmin.MyGameCtxt);
	    babyAdmin.updateScore(babyAdmin.MyGameCtxt);
	});
    });

});


var me = babyAdmin.init_connection();


babyAdmin.subscript(me);

/* init my profile and send this one to the others */
babyAdmin.init_ctxt(me);


window.onbeforeunload = function(){
    me.disconnect();
};

// /* for Safari */
window.onunload = function(){
    me.disconnect();
};

// window.abort = function(){

//     alert("onunload");
//    // me.disconnect();
//     me.unsubscribe();

// };

