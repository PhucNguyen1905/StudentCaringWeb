exports.isStudent = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
}

exports.isStaff = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/staff/login');
    }
}

exports.isConsul = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/consul/login');
    }
}