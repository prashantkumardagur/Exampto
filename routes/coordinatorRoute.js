const express = require('express');
const router = express.Router();

const exam = require('../controllers/examController');
const { isCoordinatorLoggedIn } = require('../utils/authMiddlewares');

/* ----- /coordinator/ routes --------------- */

router.get('/dashboard', isCoordinatorLoggedIn, (req, res) => { res.render('coordinator/dashboard') })
router.get('/tests', isCoordinatorLoggedIn, (req, res) => { res.render('coordinator/tests') })
router.get('/analytics', isCoordinatorLoggedIn, (req, res) => { res.render('coordinator/analytics') })
router.get('/settings', isCoordinatorLoggedIn, (req, res) => { res.render('coordinator/settings') })

router.get('/viewtest/:id', isCoordinatorLoggedIn,(req, res) => res.render('coordinator/viewtest', {testId : req.params.id}))

router.get('/createtest', isCoordinatorLoggedIn, exam.initilizeTest )
router.get('/testmaker/:id', isCoordinatorLoggedIn, (req, res) => { res.render('testmaker', {testId : req.params.id}) })


module.exports = router;