
var request = require('request');
var Promise = require('bluebird');
var colors = require('colors');
var bhtApiKey = require('./library/thesaurus');
var pretty = require('./library/pretty');
request = Promise.promisify(request);

//I found this function here: https://gist.github.com/victorquinn/8030190
//promiseWhile is used to get a for loops despite the promises
//Because apparently we can't use for loops with promises!

var promiseWhile = function(condition, action) {
  return new Promise(function(resolve, reject) {
    var loop = function() {
      if (!condition()) return resolve();
      return Promise.cast(action())
        .then(loop)
        .catch(function(e) {
          reject(e);
        });
    };
    process.nextTick(loop);
  });
};


function synonym() {
    return request('http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=true&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=3&maxLength=10&limit=5&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5'
    ).spread(
        function(res, body) {
            var dataWords = JSON.parse(body);
            return dataWords;
        }
    ).spread(
        function(word1, word2, word3, word4, word5) {
            return ([word1.word, word2.word, word3.word, word4.word, word5.word]);
        }
    ).then(
        function(arrayOfWords) {
            var i = 0,
            stopCondition = arrayOfWords.length;
            console.log(arrayOfWords);
            
            promiseWhile(function() {return i < stopCondition;}, function() {
                return request("http://words.bighugelabs.com/api/2/" + bhtApiKey.apiKey + "/" + arrayOfWords[i] + "/json"
                ).spread(
                    function(res, body){
                        //console.log(body);
                        var data = JSON.parse(body);
                        //console.log(data);
                        return data;
                    }
                ).then(
                    function(data){
                        if (data && data.noun && data.noun.syn) {
                            var synNouns = pretty.prettyOutput(data.noun.syn);
                        } 
                        else {
                            synNouns = '';
                        }
                        if (data && data.verb && data.verb.syn) {
                            var synVerbs = pretty.prettyOutput(data.verb.syn);
                        } 
                        else {
                            synVerbs = '';
                        }
                        if (data && data.adjective && data.adjective.syn) {
                            var synAdj = pretty.prettyOutput(data.adjective.syn);
                        } 
                        else {
                            synAdj = '';
                        }
        
                        console.log(colors.green('Synonyms of' + arrayOfWords[i] + ': ' + synAdj + synNouns + synVerbs));
                        i ++;
                        //console.log(i);
                    }
                );
            }
        )}
    ).catch(
        function(error){
            console.log(colors.inverse("Whoops! There was a problem: " + error));
        }    
    );
}

synonym();

