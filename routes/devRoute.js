const express = require('express');
const router = express.Router();

/* ----- Helper middlewares ------------------------------------ */

const isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        return res.redirect('/auth/login');
    }
    next();
}

/* ----- /dev/ routes ------------------------------------------ */

router.get('/' , isLoggedIn, (req, res) => {
    res.render('dev/devhome');
})

module.exports = router;