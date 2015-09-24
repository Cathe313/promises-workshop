
var prompt = require('prompt');
var request = require('request');
var Promise = require('bluebird');

prompt = Promise.promisifyAll(prompt);
request = Promise.promisify(request);

function issLocator(){
    var userLat;
    var userLong;
    var issLat;
    var issLong;
    
    prompt.start();
    prompt.getAsync(['City']).then(
        function(response){
            //This code gets the coordinates of the user:
            return request("https://maps.googleapis.com/maps/api/geocode/json?address=" + response.City);

        }    
    ).spread(function (response, body) {
        var userPoz = JSON.parse(body);
        userLat = Math.round(userPoz.results[0].geometry.location.lat * 100)/100;
        userLong = Math.round(userPoz.results[0].geometry.location.lng * 100)/100;
        console.log("You are currently at latitude " + userLat + " x longitude " + userLong + "." ); 
    }).then(
        function() {
            //This code gets the coordinates of the ISS:
            return request('http://api.open-notify.org/iss-now.json');
        }    
    ).spread(
        function (response, body) {
            var issPoz = JSON.parse(body);
            issLat = Math.round(issPoz.iss_position.latitude * 100)/100;
            issLong = Math.round(issPoz.iss_position.longitude * 100)/100;
            console.log("The space station is currently at latitude " + issLat + " and at longitude " + issLong + "." );
        }
    ).then(
        function(){
            //This super-brainy code calculates the distance between the user and the ISS:
            var R = 6371000; // metres
            var φ1 = issLat * Math.PI / 180;
            var φ2 = userLat * Math.PI / 180;
            var Δφ = (userLat-issLat) * Math.PI / 180;
            var Δλ = (userLong-issLong) * Math.PI / 180;
            var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            var d = R * c;
            console.log ("The distance between you and the ISS is " + Math.round(d / 1000) + " kilometres.");
        }
    ).catch(
        function (error) {
            console.log("Whoops, error! " + error );
        }    
    );
}

issLocator();

    