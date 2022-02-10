const express = require('express');
const router = express.Router();

const user = require('../controllers/userController');

/* ----- /user/ routes --------------- */

router.get('/dashboard', user.isUserLoggedIn, (req, res) => { res.render('user/dashboard'); });
router.get('/results', user.isUserLoggedIn, (req, res) => { res.render('user/results'); });
router.get('/explore', user.isUserLoggedIn, (req, res) => { res.render('user/explore'); });
router.get('/wallet', user.isUserLoggedIn, (req, res) => { res.render('user/wallet'); });
router.get('/profile', user.isUserLoggedIn, (req, res) => { res.render('user/profile'); });

router.get('/viewtest/:id', user.isUserLoggedIn, (req, res) => { res.render('user/viewtest', {testId : req.params.id}); });

module.exports = router;