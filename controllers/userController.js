const User = require('../mongoModels/user');

module.exports.logout = (req, res) => {
    req.logout();
    res.redirect('/');
}

module.exports.register = async (req, res) => {
    try {
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if(err) return next(err);
            res.redirect('/');
        })
    } catch(err) {
        res.send(err);
    }
}

module.exports.login = (req, res) => {
    let redirectUrl = req.session.redirectUrl || '/';
    delete req.session.redirectUrl;
    res.redirect(redirectUrl);
}