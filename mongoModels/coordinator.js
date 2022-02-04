const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const coordinatorSchema = Schema({
    name : {
        type : String,
        required : true,
        minLength : 3,
        maxLength : 32
    },
    email : {
        type : String,
        required : true,
        minLength : 3,
        maxLength : 64
    },
    phone : String,
    gender : String,
    nationality : String,
    examsCreated : [{
        type : Schema.Types.ObjectId,
        ref : 'Exam'
    }],
    meta : {
        createdOn : {
            type : Date,
            default : Date.now
        },
        isBanned : {
            type : Boolean,
            default : false
        },
        lastLogin : {
            time : {
                type : Date,
                default : Date.now
            },
            ip : String
        }
    }
});

coordinatorSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Coordinator', coordinatorSchema);