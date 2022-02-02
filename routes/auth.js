const express = require('express');
const passport = require('passport');
const router = express.Router();

const user = require('../controllers/userController');


/* ----- /auth/ routes ----- */

router.route('/login')
    .get((req,res) => { res.render('auth/login') })
    .post( passport.authenticate('local', {failureRedirect : '/auth/login'}), user.login );

router.get('/logout', user.logout )

router.route('/register')
    .get((req,res) => { res.render('auth/register') })
    .post( user.register )

    
module.exports = router;