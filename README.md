# riot-api-client

Riot Games API library
A node.js library for fetching League of Legends data from the Riot API.

Riot's API requires a API Key. More information about how to get a Key, Rate Limits and more can be found on their official Site https://developer.riotgames.com/

## Getting started
riot-api-client is a simple wrapper that will help your manage your request limit while executing your queries.
    ```javascript
    var config = {
        apiKey: 'Your api key',
        requestLimit: 'Your request limit (The one per 10 seconds)'
    }
    var apiUrl = 'https://REGION.api.pvp.net/api/lol/REGION/v1.4/summoner/by-name/SUMMONER_NAME';
    
    var riotApi = require('riot-api-client');
      riotApi.setConfig(config);
      riotApi.get(apiUrl, function callback(err, data){
          //Your code here
      });
    ```
The callback always takes two parameters, an error and the data received. The error contains the status code of the failed request if there was any issue with the request and the data contains the parsed JSON that we received.
