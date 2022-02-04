const express = require('express');
const passport = require('passport');
const router = express.Router();

const user = require('../controllers/userController');


/* ----- /auth/ routes ----- */

// User authentication routes
router.route('/register')
    .get((req,res) => { res.render('auth/register') })
    .post( user.register );

router.route('/login')
    .get((req,res) => { res.render('auth/login') })
    .post( passport.authenticate('local', {failureRedirect : '/auth/login'}), user.login );


// Logout route
router.get('/logout', (req, res) => {
    req.logout();
    delete req.session.authType;
    res.redirect('/');
} )

    
module.exports = router;