userModel = {
    _id : ObjectId,
    username : 'panditprajjawal',
    password : 'abcd1234',
    name : 'Prajjawal Pandit',
    email : 'panditprajjawal@gmail.com',
    phone : '9876543210',
    dob : '16 April 2001',
    gender : 'male',
    nationality : 'India',
    institution : {
        name : 'Lovely Professional University',
        place : 'Phagwara, Punjab',
        country : 'India'
    },
    wallet : {
        coins : 5000,
        transactions : { 
            type : ObjectId, 
            ref : 'transactions'
        },
        withdrawDetails : {
            upiID : 'panditprajjawal@oksbi',
            otherInfo : 'something'
        }
    },
    program : { enum : ['JEE', 'NEET', 'SSC'] }, //etc
    examsEnrolled : {
        type : ObjectId,
        ref : 'exams'
    },
    result : {
        type : ObjectId,
        ref: 'results'
    },
    meta : {
        createdOn : '29 Feb 2020',
        lastUpdated : '20 June 2021',
        registrationCompleted : true,
        lastLogin : {
            time : 'ISO time',
            ip : '127.0.0.1',
            city : 'Mohali',
            region : 'PB',
            country : 'IN'
        },
        isDisabled : false,
        isBanned : false
    }
}

transactions = {
    _id : ObjectId,
    transactionID : '123654789abc',
    status : 'success',
    amount : 1000,
    currency : 'ruppees',
    gateway : 'UPI',
    payee : 'Prajjawal Pandit',
    userId : {
        type : ObjectId,
        ref : 'users'
    },
    timestamp : 'ISO time',
    isRefunded : false,
    refundID : '',
    meta : {
        ip : '127.0.0.1', 
        type : {enum : ['withdraw', 'deposit', 'purchase']}, // etc
        description : 'Coins purchased from coin market',
        details : {}
    }
}


exams = {
    _id : ObjectId,
    name : 'Mock Test 2312',
    category : { enum : ['JEE', 'NEET', 'SSC']},
    marking : {
        positive : 4,
        negative : -1,
        maxMarks : 360
    },
    duration : 180, //in minutes
    startTime : 'ISO time',
    endTime : 'ISO time',
    price : 500,
    content : [{
        ques : `What is the name of Prajjawal's girlfriend?`,
        options : ['Priyanka', 'Option 2', 'Option 3', 'Single Forever'],
        ans : 4
    }],
    meta : {
        studentsEnrolled : 2013,
        resultDeclared : false,
        isPrivate : true,
        createdOn : 'ISO time',
        resultDeclaredOn : 'ISO time',
        creater : {
            type : ObjectId,
            ref : 'coordinators'
        }
    }
}


results = {
    _id : ObjectId,
    userId : {
        type : ObjectId,
        ref : 'users'
    },
    examId : {
        type : ObjectId,
        ref : 'exams'
    },
    marksAlloted : 180,
    percentile : 95.624,
    rank : 5023,
    responses : [4,2,1,0,0,2,0,3,0,4,0,3,2,3,1],
    meta : {
        startedOn : '16:00 - 24/03/2021',
        endedOn : '18:52 - 24/03/2021',
        deviceDetails : {
            browser : 'Google Chrome 97.2.1.654',
            os : 'Windows 11',
            ipAddress : '127.0.0.1'
        },
        disconnections : 2,
        validResponse : true
    }
}

coordinator = {
    _id : ObjectId,
    username : 'panditprajjawal',
    password : 'abcd1234',
    name : 'Prajjawal Pandit',
    email : 'panditprajjawal@gmail.com',
    phone : '9876543210',
    dob : '16 April 2001',
    gender : 'male',
    nationality : 'India',
    institution : {
        name : 'Lovely Professional University',
        place : 'Phagwara, Punjab',
        country : 'India'
    },
    examsCreated : {
        type : ObjectId,
        ref : 'exams'
    },
    meta : {
        createdOn : '29 Feb 2020',
        lastLogin : {
            time : 'ISO time',
            ip : '127.0.0.1',
            city : 'Mohali',
            region : 'PB',
            country : 'IN'
        },
        isBanned : false
    }
}