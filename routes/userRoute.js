const express = require('express');
const useragent = require('express-useragent');
const router = express.Router();

const result = require('../controllers/resultController');
const { isUserLoggedIn } = require('../utils/authMiddlewares');

router.use(useragent.express());

/* ----- /user/ routes --------------- */

router.get('/dashboard', isUserLoggedIn, (req, res) => { res.render('user/dashboard'); });
router.get('/results', isUserLoggedIn, (req, res) => { res.render('user/results'); });
router.get('/explore', isUserLoggedIn, (req, res) => { res.render('user/explore'); });
router.get('/wallet', isUserLoggedIn, (req, res) => { res.render('user/wallet'); });
router.get('/profile', isUserLoggedIn, (req, res) => { res.render('user/profile'); });

router.get('/viewtest/:id', isUserLoggedIn, (req, res) => { res.render('user/viewtest', {testId : req.params.id}); });


// ----- /user/attempttest/ routes ---------------

router.get('/attempttest/:id', isUserLoggedIn, result.renderTest );
router.get('/attempttest/:resultId/endtest', isUserLoggedIn, result.endTest );


module.exports = router;