/*
 * GET login page.
 */


/**
 * Render the login page
 *
 */
exports.show = function(req, res){

    console.log("i am gonna render the login page");

    res.render('login', { title: 'Login' });

};