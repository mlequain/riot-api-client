var riotAPI = require('./index.js');
var region = 'euw';
riotAPI.setConfig({
    apiKey: '53109cc1-aa16-447e-9ff7-0aa380338596',
    requestLimit: 10
});
riotAPI.get('https://' + region + '.api.pvp.net/api/lol/' + region + '/v1.4/summoner/by-name/fAitz', function(err, data){
    console.log(data);
});