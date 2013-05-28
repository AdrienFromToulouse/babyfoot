/**
 * Render the login page
 *
 */
exports.show = function(req, res){

    res.render('login', { title: 'Login' });

};