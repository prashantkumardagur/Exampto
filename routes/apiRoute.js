const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

// ----- Importing the controllers -----------------------------------
const exam = require('../controllers/examController');
const result = require('../controllers/resultController');
const user = require('../controllers/userController');

router.use(bodyParser.json());


// ----- Authentication middleware -------------------------------
const isCoordinatorLoggedIn = (req, res, next) => {
    if(req.isAuthenticated() && req.user.role === 'coordinator') next();
    else res.status(403).send({status : 'failure', message : 'You are not authorized to perform this action'});
}

const isUserLoggedIn = (req, res, next) => {
    if(req.isAuthenticated() && req.user.role === 'user' ) next();
    else res.status(403).send({status : 'failure', message : 'You are not authorized to perform this action'});
}

const isAdminLoggedIn = (req, res, next) => {
    if(req.session.admin === true) next();
    else res.status(403).send({status : 'failure', message : 'You are not authorized to perform this action'});
}


// ----- /api/ routes ----------------------------------------------------

router.get('/', (req,res) => { res.send('Hello World') });



// ----- user API routes ----------------------------------------------------

router.get('/user/enrolledtests', isUserLoggedIn, exam.getEnrolledTests);
router.get('/user/exploretests', isUserLoggedIn, exam.exploreTests);
router.get('/user/gettest/:id', isUserLoggedIn, exam.getTestForUser);
router.get('/user/myresults', isUserLoggedIn, result.getResults);

router.get('/user/enrolltest/:id', isUserLoggedIn, exam.enrollTest);
router.get('/user/getresult/:id', isUserLoggedIn, result.getResult);


// ----- cordinator API routes ----------------------------------------------------

router.get('/coordinator/mytests/', isCoordinatorLoggedIn, exam.getMyTests);
router.get('/coordinator/gettest/:id', isCoordinatorLoggedIn, exam.getTestForCoordinator);



// ----- testmaker API routes ----------------------------------------------------

router.route('/testmaker/:id')
    .get( isCoordinatorLoggedIn, exam.getTestForTestMaker)
    .delete( isCoordinatorLoggedIn, exam.deleteTest)
    .patch( isCoordinatorLoggedIn, exam.updateDetails)

router.post('/testmaker/:id/addquestion', isCoordinatorLoggedIn, exam.addQuestion)

router.get('/testmaker/:id/deletequestion/:index', isCoordinatorLoggedIn, exam.deleteQuestion)

router.post( '/testmaker/publish/:id', isCoordinatorLoggedIn, exam.publishTest)



// ----- attempt test API routes ----------------------------------------------------

router.get('/attempttest/:id/requesttest', isUserLoggedIn, exam.testRequest );
router.get('/attempttest/:resultId/getanswers', isUserLoggedIn, result.getAnswers );
router.post('/attempttest/:resultId/saveanswers', isUserLoggedIn, result.saveAnswers );
router.get('/attempttest/:resultId/disconnectionEncountered', isUserLoggedIn, result.addDisconnection );


// ----- Admin API routes ----------------------------------------------------

router.get('/admin/getuserlist', isAdminLoggedIn, user.getUserList);
router.get('/admin/getcoordinatorlist', isAdminLoggedIn, user.getCoordinatorList);


// ----- 404 API route ----------------------------------------------------

router.all('*', (req, res) => { res.status(404).send({status : 'failure', message : 'API route not found'}) });


module.exports = router;