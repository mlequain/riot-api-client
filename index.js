var request = require('request');

var apiKey = '';
var requestLimit = 0;
var TWELVE_SECONDS = 12000;

var requestCount = 0;
var timeoutCount = 0;
var requestTimestamps = [];

module.exports = function init(config){
    apiKey = config.apiKey;
    requestLimit = config.requestLimit;
    return {
        get: get,
        static: getStaticData,
        setConfig: setConfig
    }
};

function get(requestUrl, callback){
    var currentTime = new Date().getTime();
    var latestTimeout = requestTimestamps[timeoutCount];
    var timeoutDuration = 0;

    if(currentTime > (latestTimeout + TWELVE_SECONDS) && requestCount >= requestLimit && timeoutCount < requestLimit){
        requestCount--;
        requestTimestamps.splice(timeoutCount, (timeoutCount + 1));
    }
    if(requestCount >= requestLimit && timeoutCount >= requestLimit){
        timeoutDuration = (requestTimestamps[(requestLimit - 1)] + TWELVE_SECONDS) - currentTime;

        return setTimeout(function(){
            return get(requestUrl, callback);
        }, timeoutDuration);
    }
    if(requestCount >= requestLimit){
        timeoutDuration = latestTimeout - currentTime + TWELVE_SECONDS;
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
    return processRequest(requestUrl, callback);
}

function getStaticData(requestUrl, callback){
    return processRequest(requestUrl, callback);
}

function processRequest(requestUrl, callback){
    requestUrl += requestUrl.split('?')[1] ? '&' : '?';
    return request({
        method: 'GET',
        uri: requestUrl + 'api_key=' + apiKey
    }, function onData(err, response, body){
        if(err) return callback(err);
        if(response.statusCode !== 200) return callback(new Error('Status code ' + response.statusCode));
        var json = tryParse(body);
        return callback(null, json);
    });
}

function setConfig(config){
    apiKey = config.apiKey;
    requestLimit = config.requestLimit;
}

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