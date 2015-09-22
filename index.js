var request = require('request');

var apiKey = '';
var requestLimit = 0;

var requestCount = 0;
var timeoutCount = 0;
var requestTimestamps = [];

module.exports.get = function get(requestUrl, callback) {
    var currentTime = new Date().getTime();
    var latestTimeout = requestTimestamps[timeoutCount];
    var timeoutDuration = 0;

    if (currentTime > (latestTimeout + 12000) && requestCount >= requestLimit && timeoutCount < requestLimit){
        requestCount--;
        requestTimestamps.splice(timeoutCount, (timeoutCount + 1));
    }
    if (requestCount >= requestLimit && timeoutCount >= requestLimit) {
        timeoutDuration = (requestTimestamps[(requestLimit - 1)] + 12000) - currentTime;

        return setTimeout(function() {
            return get(requestUrl, callback);
        }, timeoutDuration);
    }
    if(requestCount >= requestLimit){
        timeoutDuration = latestTimeout - currentTime + 12000;
        timeoutCount++;
        return setTimeout(function onTimeout(){
            requestTimestamps.splice(0, 1);
            timeoutCount--;
            requestCount--;
            return get(requestUrl, callback);
        }, timeoutDuration);
    }

    requestCount++;
    requestTimestamps.push(currentTime);
    return processRequest(requestUrl, function onRequestData(err, data){
        if(err) return callback(err);
        return callback(null, data);
    });
};

function processRequest(requestUrl, callback){
    return request({
        method: 'GET',
        uri: requestUrl + 'api_key=' + apiKey
    }, function onData(err, response, body) {
        if(err) return callback(err);
        if(response.statusCode != 200) return callback(new Error({ statusCode: response.statusCode}));
        var json = tryParse(body);
        return callback(null, json);
    });
}

exports.init = function initRiotApi(config){
    return function onInit(done){
        apiKey = config.apiKey;
        requestLimit = config.requestLimit;
        return done();
    };
};

function tryParse(obj){
    try{
        return JSON.parse(obj);
    } catch(err){
        console.warn('Failed to parse JSON : ' + err.message, {
            message: err.message,
            stack: err.stack,
            data: obj
        });
        return null;
    }
}