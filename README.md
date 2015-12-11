[![npm version](https://badge.fury.io/js/riot-api-client.svg)](https://badge.fury.io/js/riot-api-client)
# riot-api-client

Riot Games API library
A node.js library for fetching League of Legends data from the Riot API.

Riot's API requires an API Key. More information about how to get a key and the rate limits on the official website (https://developer.riotgames.com/)

## Getting started
riot-api-client is a simple wrapper that will help your manage your request limit while executing your queries.

The callback always takes two parameters, an error and the data received. The error contains the status code of the failed request if there was any issue with the request and the data contains the parsed JSON that has been received.

```javascript
var config = {
    apiKey: 'Your api key',
    requestLimit: 'Your request limit (The one per 10 seconds)'
}
var apiUrl = 'https://REGION.api.pvp.net/api/lol/REGION/v1.4/summoner/by-name/SUMMONER_NAME';

var riotApi = require('riot-api-client')(config);
riotApi.get(apiUrl, function callback(err, data){
    //Your code here
});
```

## Static data
You can also get static data without using the request limitation module

```javascript

var apiUrl = 'https://global.api.pvp.net/api/lol/static-data/REGION/v1.2/champion';

riotApi.static(apiUrl, function callback(err, data){
    //Your code here
});
```

## Set config
The config can be updated anytime by using the setConfig function

```javascript
var updatedConfig = {
    apiKey: 'Your api key',
    requestLimit: 'Your request limit (The one per 10 seconds)'
}

riotApi.setConfig(updatedConfig);
```

## Error reporting
Do not hesitate to create a github issue if you encounter any error or bug
