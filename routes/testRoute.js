const express = require('express');
const useragent = require('express-useragent');
const router = express.Router();

const user = require('../controllers/userController');
const exam = require('../controllers/examController');
const result = require('../controllers/resultController');

router.use(useragent.express());

/* ----- /attempttest/ routes --------------- */

router.get('/:id', user.isUserLoggedIn, result.renderTest );
router.get('/:resultId/endtest', user.isUserLoggedIn, result.endTest );

router.get('/:id/requesttest', user.isUserLoggedIn, exam.testRequest );
router.get('/:resultId/getanswers', user.isUserLoggedIn, result.getAnswers );
router.post('/:resultId/saveanswers', user.isUserLoggedIn, result.saveAnswers );


module.exports = router;