// Checks if a user is logged in
module.exports.isUserLoggedIn = (req, res, next) => {
    if(req.isAuthenticated() && req.user.role === 'user') next();
    else {
        req.session.redirectUrl = req.originalUrl;
        return res.redirect('/auth/login');
    }
}

// Checks if a coordinator is logged in
module.exports.isCoordinatorLoggedIn = (req, res, next) => {
    if(req.isAuthenticated() && req.user.role === 'coordinator') next();
    else {
        req.session.redirectUrl = req.originalUrl;
        return res.redirect('/auth/login');
    }
}

// Checks if an admin is logged in
module.exports.isAdminLoggedIn = (req, res, next) => {
    if(req.session.admin === true) next();
    else return res.redirect('/admin/');
}