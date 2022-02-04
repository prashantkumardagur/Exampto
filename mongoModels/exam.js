const mongoose = require('mongoose');
const { Schema } = mongoose.Schema;

const examSchema = Schema({
    name : String,
    category : { 
        type : String,
        enum : ['JEE', 'NEET', 'SSC']
    },
    marking : {
        positive : Number,
        negative : Number,
        maxMarks : Number,
    },
    duration : Number,
    startTime : Date,
    endTime : Date,
    price : Number,
    contents : [{
        ques : String,
        options : [String]
    }],
    answers : [Number],
    meta : {
        studentsEnrolled : Number,
        resultDeclared : Boolean,
        isPrivate : Boolean,
        createdOn : Date,
        resultDeclaredOn : Date,
        creater : {
            type : Schema.Types.ObjectId,
            ref : 'Coordinator'
        }
    }
});

module.exports = mongoose.model('Exam', examSchema);