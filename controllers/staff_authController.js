const passport = require('passport');

// Login
exports.viewLogin = (req, res) => {
    if (res.locals.user) {
        res.redirect('/staff');
    }
    res.render('staff/login_staff');
}

exports.login = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/staff',
        failureRedirect: '/staff/login',
        failureFlash: false
    })(req, res, next);
}

// GET logout
exports.logout = (req, res) => {
    req.logout();
    res.redirect('/staff/login');
}
