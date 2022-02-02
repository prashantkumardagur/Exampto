const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    name : String,
    email : String,
    phone : String,
    dob : Date,
    gender : String,
    program : { enum: ['JEE', 'NEET', 'SSC']},
    nationality : String,
    institution : {
        name : String,
        location : String,
        country : String
    },
    wallet : {
        coins : Number,
        transactions : String,
        withdrawDetails : {
            method : String,
            id : String
        }
    },
    examsEnrolled : {
        id : String
    },
    results : {
        id : String
    },
    meta : {
        createdOn : Date,
        lastUpdated : Date,
        registrationCompleted : Boolean,
        isDisabled : Boolean,
        isBanned : Boolean,
        lastLogin : {
            time : Date,
            ip : String
        }
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports =  mongoose.model('User', userSchema);