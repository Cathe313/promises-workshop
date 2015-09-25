
var prompt = require('prompt');
var request = require('request');
var Promise = require('bluebird');

prompt = Promise.promisifyAll(prompt);
request = Promise.promisify(request);

function userLocator(){
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
            return {userLat: userLat, userLong: userLong};
        }
    );
}

function issLocator(){
    return request('http://api.open-notify.org/iss-now.json').spread(
        function (response, body) {
            var issPoz = JSON.parse(body);
            var issLat = Math.round(issPoz.iss_position.latitude * 100)/100;
            var issLong = Math.round(issPoz.iss_position.longitude * 100)/100;
            //console.log("The space station is currently at latitude " + issLat + " and at longitude " + issLong + "." );
            return {issLat: issLat, issLong: issLong};
        }
    );    
}        
        
function issDistance() {       
    return Promise.join(userLocator(), issLocator(), 
        function(userPoz, issPoz){
            var R = 6371000; // metres
            var φ1 = issPoz.issLat * Math.PI / 180;
            var φ2 = userPoz.userLat * Math.PI / 180;
            var Δφ = (userPoz.userLat-issPoz.issLat) * Math.PI / 180;
            var Δλ = (userPoz.userLong-issPoz.issLong) * Math.PI / 180;
            var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            var d = R * c;
            return Math.round(d / 1000);
        }
    ).catch(
        function (error) {
            console.log("Whoops, error! " + error );
        }    
    );
}        
    
issDistance().then(function(dist){
    console.log ("The distance between you and the ISS is " + dist + " kilometres.");
});

    