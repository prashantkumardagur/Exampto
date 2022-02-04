const express = require('express');
const router = express.Router();

/* ----- Helper Functions -------------*/

const isUserLoggedIn = (req, res, next) => {
    if(req.isAuthenticated() && req.session.authType === 'user') next();
    else {
        req.session.redirectUrl = req.originalUrl;
        return res.redirect('/auth/login');
    }
}

/* ----- /user/ routes --------------- */

router.get('/dashboard', isUserLoggedIn, (req, res) => { res.render('user/dashboard'); });
router.get('/results', isUserLoggedIn, (req, res) => { res.render('user/results'); });
router.get('/explore', isUserLoggedIn, (req, res) => { res.render('user/explore'); });
router.get('/wallet', isUserLoggedIn, (req, res) => { res.render('user/wallet'); });
router.get('/profile', isUserLoggedIn, (req, res) => { res.render('user/profile'); });

module.exports = router;