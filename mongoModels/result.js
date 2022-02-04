const mongoose = require('mongoose');
const { Schema } = mongoose.Schema;

const resultSchema = Schema({
    user : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    exam : {
        type : Schema.Types.ObjectId,
        ref : 'Exam'
    },
    marksAllocated : Number,
    percentile : Number,
    rank : Number,
    responses : [Number],
    meta : {
        startedOn : Date,
        endedOn : Date,
        deviceDetails : {
            browser : String,
            os : String,
            ip : String,
        },
        disconnections : Number,
        isValid : Boolean
    }
});

module.exports = mongoose.model('Result', resultSchema);