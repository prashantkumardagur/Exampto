const User = require('../mongoModels/user');

module.exports.register = async (req, res) => {
    try {
        const {name, email, username, password} = req.body;
        const user = new User({
            name,
            email,
            username,
            meta : { lastLogin : { ip : req.ip }}
        });

        const registeredUser = await User.register(user, password);

        req.login(registeredUser, (err) => {
            if(err) return next(err);
            req.session.authType = 'user';
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