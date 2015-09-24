
var Promise = require('bluebird');

function delay(time) {
    return new Promise(function(resolve) {
        setTimeout(resolve, time);
    })
};  

function liftoff() {
    delay(1000).then(
        function(){
            console.log("ONE");
            return delay(1000);
        }
    ).then (
        function() {
            console.log("TWO");
            return delay(1000);
        }    
    ).then (
        function(){
            console.log("THREE");
            return delay(1000);
        }
    ).then (
        function(){
            console.log("...LIFTOFF!");
        }
    ).catch(
        function(error) {
           console.log('Whoops! ' + error); 
        }
    )
    
}

liftoff();
