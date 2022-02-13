const User = require('../models/user');

// Registers a new user
module.exports.register = async (req, res) => {
    try {
        const {name, email, username, password, role} = req.body;
        const user = new User({
            name,
            email,
            username,
            role,
            meta : { lastLogin : { ip : req.ip }}
        });

        const registeredUser = await User.register(user, password);

        req.login(registeredUser, (err) => {
            if(err) return next(err);
            res.redirect('/');
        });

    } catch(err) {
        res.send(err);
    }
}

// Logs in a user or coordinator
module.exports.login = (req, res) => {
    let redirectUrl = req.session.redirectUrl || '/';
    delete req.session.redirectUrl;
    res.redirect(redirectUrl);
}