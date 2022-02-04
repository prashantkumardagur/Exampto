const express = require('express');
const router = express.Router();

/* ----- Helper Functions -------------*/

const isCoordinatorLoggedIn = (req, res, next) => {
    if(req.isAuthenticated() && req.session.authType === 'coordinator') next();
    else {
        req.session.redirectUrl = req.originalUrl;
        return res.redirect('/auth/adminlogin');
    }
}

/* ----- /user/ routes --------------- */

router.get('/dashboard', isCoordinatorLoggedIn, (req, res) => { res.send('Coordinator Dashboard') })


module.exports = router;