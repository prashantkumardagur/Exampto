const result = require('../models/result');
const Result = require('../models/result');
const { respondSuccess , respondFailure } = require('../utils/responders');



// ===== Attempt test controller ==============================================================================

// Initializes the test and renders the test page
module.exports.renderTest = async (req, res) => { 
    let resultexists = await Result.exists({user : req.user._id, exam : req.params.id});
    if(!resultexists) { 
        const result = new Result({
            user : req.user._id,
            exam : req.params.id,
            responses : [],
            meta : {
                startedOn : Date.now(),
                deviceDetails : {
                    browser : req.useragent.browser + req.useragent.version,
                    os : req.useragent.os,
                    ip : req.ip
                }
            }
        });
        await result.save();
    }
    res.render('attemptTest', {testId : req.params.id , resultId : resultexists ? resultexists._id : result._id});
}


// Returns users saved answers
module.exports.getAnswers = async (req, res) => {
    try {
        let result = await Result.findById(req.params.resultId, {responses: 1});
        if(result) respondSuccess(res, "Answers found", result.responses);
        else respondSuccess(res, "Answers not found", []);
    } catch(err) {
        respondFailure(res, "Invalid result id", 400);
    }
}

// Saves users answers
module.exports.saveAnswers = async (req, res) => {
    try {
        let result = await Result.findByIdAndUpdate(req.params.resultId, {responses : req.body.responses}, {new : true});
        if(result) respondSuccess(res, "Answers saved");
        else respondFailure(res, "Error saving answers", 500);
    } catch(err) {
        respondFailure(res, "Error saving answers", 400);
    }
}


// Ends the test and redirects to the user dashboard
module.exports.endTest = async (req, res) => {
    try {
        let result = await Result.findById(req.params.resultId).populate('exam');

        // Update the meta data
        result.meta.endedOn = Date.now();
        result.meta.ended = true;

        // Calculate marks
        let marks = 0;
        result.responses.forEach((response, index) => {
            if(response == result.exam.answers[index]) marks += result.exam.marking.positive;
            else marks -= result.exam.marking.negative;
        });
        result.marksAllocated = marks;

        // Save result
        result.save();
        res.redirect('/user/dashboard');

    } catch(err) {
        res.redirect('/user/dashboard');
    }
}


// ===== User dashboard conrollers =====================================================================

// Returns users all results
module.exports.getResults = async (req, res) => {
    let results = await Result.find(
        {user : req.user._id},
        {exam: 1, marksAllocated: 1, rank: 1, percentile: 1, meta: 1}
        ).populate('exam', 'name');
    respondSuccess(res, "Results fetched", results);
}