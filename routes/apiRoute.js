const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

// ----- Inporting the controllers -----
const user = require('../controllers/userController');
const exam = require('../controllers/examController');
const result = require('../controllers/resultController');

router.use(bodyParser.json());


// ----- Authentication middleware -----
const isCoordinatorLoggedIn = (req, res, next) => {
    if(req.isAuthenticated() && req.session.authType === 'coordinator') next();
    else res.status(403).send({status : 'failure', message : 'You are not authorized to perform this action'});
}

const isUserLoggedIn = (req, res, next) => {
    if(req.isAuthenticated() && req.session.authType === 'user' ) next();
    else res.status(403).send({status : 'failure', message : 'You are not authorized to perform this action'});
}


// ----- /api/ routes ----------------------------------------------------

router.get('/', (req,res) => { res.send('Hello World') });


// ----- user API routes ----------------------------------------------------

router.get('/user/exploretests', isUserLoggedIn, exam.exploreTests);
router.get('/user/gettest/:id', isUserLoggedIn, exam.getTestForUser);
router.get('/user/myresults', isUserLoggedIn, result.getResults);


// ----- cordinator API routes ----------------------------------------------------

router.get('/coordinator/mytests/', isCoordinatorLoggedIn, exam.getMyTests);

router.route('/coordinator/gettest/')
    .get( isCoordinatorLoggedIn, exam.getTestForCoordinator)
    .delete( isCoordinatorLoggedIn, exam.deleteTest)
    .patch( isCoordinatorLoggedIn, exam.updateDetails)

// ----- testmaker API routes ----------------------------------------------------

router.route('/testmaker/:id/')
    .post( isCoordinatorLoggedIn, exam.addQuestion)

router.post( '/testmaker/publish/:id', isCoordinatorLoggedIn, exam.publishTest)


// ----- 404 API route ----------------------------------------------------

router.all('*', (req, res) => { res.status(404).send({status : 'failure', message : 'API route not found'}) });


module.exports = router;