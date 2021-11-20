const passport = require('passport');

// Login
exports.viewLogin = (req, res) => {
    if (res.locals.user) {
        res.redirect('/consul');
    }
    res.render('consultant/login_consul');
}

exports.login = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/consul',
        failureRedirect: '/consul/login',
        failureFlash: false
    })(req, res, next);
}

// GET logout
exports.logout = (req, res) => {
    req.logout();
    res.redirect('/consul/login');
}
