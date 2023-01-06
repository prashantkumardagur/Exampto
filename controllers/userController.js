const User = require('../models/user');
const { respondSuccess , respondFailure } = require('../utils/responders');

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

        if(role === 'user')
        req.login(registeredUser, (err) => {
            if(err) return next(err);
            res.redirect('/');
        });

        else{
            res.redirect('/admin/coordinators');
        }

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

//Admin login
module.exports.adminLogin = (req, res) => {
    let adminPassword = process.env.ADMIN_PASSWORD || 'adminPassword';
    if(req.body.password === adminPassword) {
        req.session.admin = true;
        res.redirect('/admin/dashboard');
    } else {
        res.redirect('/admin/');
    }
}

//Admin logout
module.exports.adminLogout = (req, res) => {
    delete req.session.admin;
    res.redirect('/');
}

// Gets list of all users
module.exports.getUserList = async (req, res) => {
    try {
        const users = await User.find({role: 'user'}, {username: 1, name: 1, email: 1, role: 1});
        respondSuccess(res, 'User list fetched successfully', users);
    } catch(err) {
        respondFailure(res, 'Failed to fetch user list');
    }
}

// Gets list of all coordinators
module.exports.getCoordinatorList = async (req, res) => {
    try {
        const coordinators = await User.find({role: 'coordinator'}, {username: 1, name: 1, email: 1, role: 1});
        respondSuccess(res, 'User list fetched successfully', coordinators);
    } catch(err) {
        respondFailure(res, 'Failed to fetch user list');
    }
}