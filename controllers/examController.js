const Exam = require('../mongoModels/exam');
const { respondSuccess , respondFailure } = require('../utils/responders');

// --------------------------------------------------------------------------------------------

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

// gets all the tests created by the logged in coordinator
module.exports.getMyTests = async (req, res) => {
    let myExams = await Exam.find({"meta.creater" : req.user});
    if(myExams) respondSuccess(res, 'Successfully fetched tests', myExams);
    else respondFailure(res, 'No tests found');
}

// gets the test with the given id
module.exports.getTestForCoordinator = async (req, res) => {
    if(!req.query.id) return respondFailure(res, 'No test id found', 400);
    try { 
        let exam = await Exam.findById(req.query.id);
        if(exam) respondSuccess(res, 'Successfully fetched test', exam);
        else respondFailure(res, 'No test found');
    } catch(err) { 
        respondFailure(res, 'Invalid test id', 400);
    }
}


// ----- Test maker controller -------------------------------------------------------

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





// ----- User side exam controller ---------------------------------------------------

module.exports.exploreTests = async (req, res) => {
    let exams = await Exam.find({"meta.isPublished" : true, "meta.isPrivate" : false, "meta.resultDeclared" : false});
    if(exams) respondSuccess(res, 'Successfully fetched tests', exams);
    else respondFailure(res, 'No tests found', 200);
}

module.exports.getTestForUser = async (req, res) => {
    if(!req.params.id) return respondFailure(res, 'No test id found', 400);
    try{
        let exam = await Exam.findById(req.params.id);
        if(exam) respondSuccess(res, 'Successfully fetched test', exam);
        else respondFailure(res, 'No test found', 400);
    } catch(err) {
        respondFailure(res, 'Invalid test id', 400);
    }
}


// ----- Test Attempt controller ----------------------------------------------------------

module.exports.testRequest = async (req, res) => {
    if(!req.params.id) return respondFailure(res, 'No test id found', 400);
    try{
        let exam = await Exam.findById(req.params.id);
        if(exam) respondSuccess(res, 'Successfully fetched test', exam);
        else respondFailure(res, 'No test found', 400);
    } catch(err) {
        respondFailure(res, 'Error requesting test');
    }
}