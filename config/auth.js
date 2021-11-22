exports.isStudent = function (req, res, next) {
    if (req.isAuthenticated() && res.locals.user.role_id == 0) {
        next();
    } else {
        if (res.locals.user) {
            req.logout();
        }
        res.redirect('/login');
    }
}

exports.isStaff = function (req, res, next) {
    if (req.isAuthenticated() && res.locals.user.role_id == 1) {
        next();
    } else {
        if (res.locals.user) {
            req.logout();
        }
        res.redirect('/staff/login');
    }
}

exports.isConsul = function (req, res, next) {
    if (req.isAuthenticated() && res.locals.user.role_id == 2) {
        next();
    } else {
        if (res.locals.user) {
            req.logout();
        }
        res.redirect('/consul/login');
    }
}