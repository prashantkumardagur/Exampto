const express = require('express');
const router = express.Router();
const useragent = require('express-useragent');

/* ----- Helper middlewares ------------------------------------ */

const isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        return res.redirect('/auth/login');
    }
    next();
}

router.use(useragent.express());

/* ----- /dev/ routes ------------------------------------------ */

router.get('/' , isLoggedIn, (req, res) => {
    res.render('dev/devhome');
})

router.get('/devicecheck' , isLoggedIn, (req, res) => {res.send(req.useragent)})

module.exports = router;