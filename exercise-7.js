var request = require('request');
var prompt = require('prompt');
var Promise = require('bluebird');
var Table = require('cli-table');
var colors = require('colors');
var weather = require('./library/weather');
prompt = Promise.promisifyAll(prompt);
request = Promise.promisify(request);

function weatherApp(){
    var day = 1;
    var arrayOfData = [];
    prompt.start();
    return prompt.getAsync(['City']
    ).then(
        function(response){
            return request("https://maps.googleapis.com/maps/api/geocode/json?address=" + response.City);
        }    
    ).spread(
        function (response, body) {
            var userPoz = JSON.parse(body);
            var userLat = Math.round(userPoz.results[0].geometry.location.lat * 100)/100;
            var userLong = Math.round(userPoz.results[0].geometry.location.lng * 100)/100;
            return [userLat, userLong];
        }
    ).then(
        function(userPoz){
            return request('https://api.forecast.io/forecast/' + weather.forecastApiKey + '/' + userPoz[0] + ',' + userPoz[1]);
        }
    ).spread(
        function(response, body){
            var data = JSON.parse(body);
            return data.daily.data;
    }).map(
        function(parsedData) {
            var emoji = "";
            if (parsedData) {
                if (parsedData.icon === "clear-day") {
                    emoji = "☀";
                }
                else if (parsedData.icon === "rain") {
                    emoji = "☔";
                }
                else if (parsedData.icon === "partly-cloudy-day") {
                    emoji = "⛅";
                }
                else if (parsedData.icon === "partly-cloudy-night") {
                    emoji = "☁️";
                }
                else if (parsedData.icon === "wind") {
                    emoji = "💨";
                }
                else if (parsedData.icon === "cloudy") {
                    emoji = "☁️";
                }
                else if (parsedData.icon === "snow") {
                    emoji = "❄️️";
                }
                else {
                    emoji = parsedData.icon;
                }
                arrayOfData.push([colors.rainbow('Day ' + day), colors.cyan(((parsedData.temperatureMin - 32) * 5/9).toFixed(1)), colors.green(((parsedData.temperatureMax - 32) * 5/9).toFixed(1)), emoji, colors.yellow(parsedData.summary)]);
                day ++;
            }    
        }
    ).then(
        function() {
            var cityWeather = new Table({
                head: ['Day', 'Min (C)', 'Max (C)', 'Icon', 'Summary'],
                colWidths: [10, 15, 15, 8, 60]
                });
            for (var i=0; i<arrayOfData.length; i++) {
                cityWeather.push(arrayOfData[i]);
            }
            console.log(cityWeather.toString());
            return cityWeather;
        }
    ).catch(
        function(error){
            console.log("Sorry, there's been an " + error);
        }
    );
    
}
weatherApp()
