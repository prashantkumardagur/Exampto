const Exam = require('../models/exam');
const User = require('../models/user');
const { respondSuccess , respondFailure } = require('../utils/responders');


// ----- User side exam controller -----------------------------------------------------------------------

// Returns the tests user has enrolled for
module.exports.getEnrolledTests = async (req, res) => {
    let enrolledTests = await User.findById(
        {_id: req.user.id},
        {examsEnrolled: 1}
        ).populate('examsEnrolled', {contents: 0, solutions: 0});
    let responseData = enrolledTests.examsEnrolled.map(exam => {
        let data = exam.toJSON();
        data.totalQuestions = data.answers.length;
        data.answers = [];
        return data;
    })
    respondSuccess(res, 'Successfully fetched enrolled tests', responseData);
}

// Returns the available upcoming tests for the user
module.exports.exploreTests = async (req, res) => {
    let exams = await Exam.find({"meta.isPublished" : true, "meta.isPrivate" : false, "meta.resultDeclared" : false},
        {name: 1, category: 1, duration: 1, meta: 1, startTime: 1, answers: 1});
    let responseData = exams.map(exam => { 
        let data = exam.toJSON();
        data.totalQuestions = data.answers.length;
        data.answers = [];
        return data;
    });
    respondSuccess(res, 'Successfully fetched available tests', responseData);
}

// Returns the test with the id provided in params
module.exports.getTestForUser = async (req, res) => {
    try{
        let exam = await Exam.findById(req.params.id, {contents: 0, solutions: 0});
        if(!exam) return respondFailure(res, 'No test found', 404);
        let responseData = exam.toJSON();
        responseData.totalQuestions = responseData.answers.length;
        responseData.answers = [];
        responseData.enrolled = req.user.examsEnrolled.includes(exam._id);;
        respondSuccess(res, 'Successfully fetched test', responseData);
    } catch(err) {
        respondFailure(res, 'Invalid test id', 400);
    }
}

// Enrolls the user for the test with the given id
module.exports.enrollTest = async (req, res) => {
    try{
        let examId = req.params.id;
        if(req.user.examsEnrolled.includes(examId)) return respondSuccess(res, 'Already enrolled for this test');
        let exam = await Exam.findById(examId);
        if(!exam) return respondFailure(res, 'No test found', 404);
        if(!exam.meta.isPublished && exam.meta.resultDeclared) return respondFailure(res, 'Bad request', 400);
        await User.findByIdAndUpdate(req.user.id, {$push: {examsEnrolled: examId}});
        exam.meta.studentsEnrolled++;
        await exam.save();
        respondSuccess(res, 'Successfully enrolled for test');
    } catch(err) {
        respondFailure(res, 'Error enrolling for test');
    }
}



// ----- Coordinator side exam controller -------------------------------------------------------------------

// gets all the tests created by the logged in coordinator
module.exports.getMyTests = async (req, res) => {
    let myExams = await Exam.find({"meta.creater" : req.user.id}, {contents: 0, solutions: 0, answers: 0});
    respondSuccess(res, 'Successfully fetched tests', myExams);
}

// gets the test with the given id
module.exports.getTestForCoordinator = async (req, res) => {
    try { 
        let exam = await Exam.findById(req.params.id, {contents: 0, solutions: 0});
        if(!exam) return respondFailure(res, 'No test found', 404);
        let responseData = exam.toJSON();
        responseData.totalQuestions = responseData.answers.length;
        responseData.answers = [];
        respondSuccess(res, 'Successfully fetched test', responseData);
    } catch(err) { 
        respondFailure(res, 'Invalid test id', 400);
    }
}


// ----- Test maker controller -------------------------------------------------------


// initializes a new test for the logged in coordinator
module.exports.initilizeTest = (req, res) => {
    const exam = new Exam({
        name : 'New Test Name',
        category : 'JEE',
        marking : {
            positive : 4,
            negative : 1,
        },
        duration : 180,
        startTime : Date.now() + 604800000,
        lastStartTime : Date.now() + 605400000,
        price : 0,
        solutions : '',
        contents : [],
        answers : [],
        meta : {
            studentsEnrolled : 0,
            resultDeclared : false,
            isPublished : false,
            isPrivate : false,
            createdOn : Date.now(),
            creater : req.user
        }
    });
    exam.save();
    res.redirect('/coordinator/testmaker/' + exam._id);
}

// gets the test with the given id
module.exports.getTestForTestMaker = async (req, res) => {
    try { 
        let exam = await Exam.findById(req.params.id);
        if(exam) respondSuccess(res, 'Successfully fetched test', exam);
        else respondFailure(res, 'No test found', 404);
    } catch(err) { 
        respondFailure(res, 'Invalid test id', 400);
    }
}

// Updates basic details of the test
module.exports.updateDetails = async (req, res) => {
    try{
        let exam = await Exam.findById(req.body.id);
        if(!exam) return respondFailure(res, 'No test found', 400);

        exam.name = req.body.name;
        exam.category = req.body.category;
        exam.marking = {
            positive : req.body.positive,
            negative : req.body.negative
        }
        exam.duration = req.body.duration;
        exam.startTime = req.body.startTime;
        exam.lastStartTime = req.body.lastStartTime;
        exam.price = req.body.price;
        await exam.save();
        respondSuccess(res, 'Successfully updated test details');
    } catch(err) {
        respondFailure(res, 'Error updating test details');
    }
}

// Deletes the test with the given id
module.exports.deleteTest = async (req, res) => {
    if(!req.query.id) return respondFailure(res, 'No test id found', 400);
    try{
        let exam = await Exam.findByIdAndDelete(req.query.id);
        if(exam) respondSuccess(res, 'Successfully deleted test');
        else respondFailure(res, 'Error deleting test');
    } catch(err) {
        respondFailure(res, 'Error deleting test');
    }
}

// Adds the questions to the test
module.exports.addQuestion = async (req, res) => {
    if(!req.body.id) return respondFailure(res, 'No test id found', 400);
    let {question , options , answer} = req.body;
    try{
        let exam = await Exam.findByIdAndUpdate(req.body.id, {
            $push : {contents : {question , options}, answers : answer}
        });
        if(exam) respondSuccess(res, 'Successfully added question');
        else respondFailure(res, 'Error adding question');
    } catch(err) {
        respondFailure(res, 'Error adding question');
    }
}



// ----- Test configuration controller ------------------------------------------------

// Publishes the test with the given id
module.exports.publishTest = async (req, res) => {
    if(!req.params.id) return respondFailure(res, 'No test id found', 400);
    try{
        let exam = await Exam.findByIdAndUpdate(req.params.id, {
            $set : {"meta.isPublished" : true}
        });
        if(exam) respondSuccess(res, 'Successfully published test');
        else respondFailure(res, 'Test not found', 400);
    } catch(err) {
        respondFailure(res, 'Error publishing test');
    }
}




// ----- Test Attempt controller ----------------------------------------------------------

// Returns the test with the given id
module.exports.testRequest = async (req, res) => {
    try{
        let exam = await Exam.findById(req.params.id, {answers: 0, solutions: 0});
        if(exam) respondSuccess(res, 'Successfully fetched test', exam);
        else respondFailure(res, 'No test found', 404);
    } catch(err) {
        respondFailure(res, 'Error requesting test', 400);
    }
}