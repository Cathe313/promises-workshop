
var request = require('request');
var Promise = require('bluebird');
var colors = require('colors');
var bhtApiKey = require('./library/thesaurus');
var pretty = require('./library/pretty');
request = Promise.promisify(request);

function synonym() {
    return request('http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=true&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=20&maxDictionaryCount=-1&minLength=3&maxLength=10&limit=5&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5'
    ).spread(
        function(res, body) {
            return JSON.parse(body);
        }).map(
            function(res, id, num){
                return request("http://words.bighugelabs.com/api/2/" + bhtApiKey.apiKey + "/" + res.word + "/json"
            ).spread(
                function(res, body){
                    var data = JSON.parse(body);
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
    
                    console.log(colors.green('Synonyms of ' + res.word + ': ' + synAdj + synNouns + synVerbs));
                }
            );
        }
        
    ).catch(
        function(error){
            console.log(colors.inverse("Whoops! There was a problem: " + error));
        }    
    );
}

synonym();

