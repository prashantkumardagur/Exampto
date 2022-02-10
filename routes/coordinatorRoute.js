const express = require('express');
const router = express.Router();

const user = require('../controllers/userController');
const exam = require('../controllers/examController');

/* ----- /coordinator/ routes --------------- */

router.get('/dashboard', user.isCoordinatorLoggedIn, (req, res) => { res.render('coordinator/dashboard') })
router.get('/tests', user.isCoordinatorLoggedIn, (req, res) => { res.render('coordinator/tests') })
router.get('/analytics', user.isCoordinatorLoggedIn, (req, res) => { res.render('coordinator/analytics') })
router.get('/settings', user.isCoordinatorLoggedIn, (req, res) => { res.render('coordinator/settings') })

router.get('/viewtest/:id', user.isCoordinatorLoggedIn,(req, res) => res.render('coordinator/viewtest', {testId : req.params.id}))

router.get('/createtest', user.isCoordinatorLoggedIn, exam.initilizeTest )
router.get('/testmaker/:id', user.isCoordinatorLoggedIn, (req, res) => { res.render('coordinator/testmaker', {testId : req.params.id}) })


module.exports = router;