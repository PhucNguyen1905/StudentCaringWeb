const passport = require('passport');

// Login
exports.viewLogin = (req, res) => {
    if (res.locals.user) {
        res.redirect('/');
    }
    res.render('login');
}

exports.login = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/index',
        failureRedirect: '/login',
        failureFlash: false
    })(req, res, next);
}

// GET logout
exports.logout = (req, res) => {
    req.logout();
    res.redirect('/login');
}
