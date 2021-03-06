// success API responder
module.exports.respondSuccess = (res, message, data) => {
    let apiResponse = { status : 'success' , message };
    if(data) apiResponse.data = data;
    res.send(apiResponse);
}

// failure API responder 
module.exports.respondFailure = (res, message, code = 500) => {
    res.status(code).send({status : 'failure', message});
}