
var Promise = require('bluebird');

//Delay function from previous exercise:

function delay(time) {
    return new Promise(function(resolve) {
        setTimeout(resolve, time);
    });
}

//This function returns a promise with a function that resolves with the first letter on an inputted string:

function getFirstChar(word){
    return delay(500).then(function(){
        //Testing:
        console.log(word[0]);
        return word[0];
    });
}

//Testing getFirstChar:

getFirstChar("Bonjour");

//This function returns a promise with a function that resolves with the last letter on an inputted string:

function getLastChar(word){
    return delay(500).then(function() {
        //testing console.log:
        console.log(word[word.length -1]);
        return word[word.length - 1];
    });
}

//Testing getLastChar:

getLastChar("Bonjour");

//This function takes a string, and returns a Promise that will be resolved with the first and last 
//character of the passed string. It uses the two previous functions in sequence.

function getFirstAndLastCharSeq(randomWord){
    var firstChar;
    return getFirstChar(randomWord).then(
        function(first) {
            firstChar = first;
            return getLastChar(randomWord);
        }).then(
            function(last){
                return firstChar + last;
        });
}

getFirstAndLastCharSeq("Hello there!");

/* Testing:
getFirstAndLastCharSeq("Hello there!").then(
    function(firstLast) {
        console.log(firstLast);
    });
*/

function getFirstAndLastCharParallel(randomWord){
    return Promise.join(getFirstChar(randomWord), getLastChar(randomWord), function (firstChar, lastChar) {
        return firstChar + lastChar;
    });
}

getFirstAndLastCharParallel("Testing...");






