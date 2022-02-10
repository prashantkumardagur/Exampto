const User = require('../mongoModels/user');

module.exports.register = async (req, res) => {
    try {
        const {name, email, username, password, utype} = req.body;
        const user = new User({
            name,
            email,
            username,
            utype,
            meta : { lastLogin : { ip : req.ip }}
        });

        const registeredUser = await User.register(user, password);

        req.login(registeredUser, (err) => {
            if(err) return next(err);
            req.session.authType = registeredUser.utype;
            res.redirect('/');
        });

    } catch(err) {
        res.send(err);
    }
}

module.exports.login = (req, res) => {
    let redirectUrl = req.session.redirectUrl || '/';
    delete req.session.redirectUrl;
    req.session.authType = req.user.utype;
    res.redirect(redirectUrl);
}

module.exports.isUserLoggedIn = (req, res, next) => {
    if(req.isAuthenticated() && req.session.authType === 'user') next();
    else {
        req.session.redirectUrl = req.originalUrl;
        return res.redirect('/auth/login');
    }
}

module.exports.isCoordinatorLoggedIn = (req, res, next) => {
    if(req.isAuthenticated() && req.session.authType === 'coordinator') next();
    else {
        req.session.redirectUrl = req.originalUrl;
        return res.redirect('/auth/login');
    }
}