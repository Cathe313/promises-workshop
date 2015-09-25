var prompt = require('prompt');
var request = require('request');
var Promise = require('bluebird');
var colors = require('colors');
var bhtApiKey = require('./library/thesaurus');
var pretty = require('./library/pretty');
prompt = Promise.promisifyAll(prompt);
request = Promise.promisify(request);


function synonym() {
    var synNouns;
    var synVerbs;
    var synAdj;

    prompt.start();
    prompt.getAsync(['Word']).then(
        function(response) {
            return request("http://words.bighugelabs.com/api/2/" + bhtApiKey.apiKey + "/" + response.Word + "/json");
        }
        ).spread(
            function(res, body){
                var data = JSON.parse(body);
                return data;
            }    
    ).then(
        function(data){
            if (data && data.noun && data.noun.syn) {
                synNouns = pretty.prettyOutput(data.noun.syn);
              } else {
                synNouns = '';
              }
              
              if (data && data.verb && data.verb.syn) {
                synVerbs = pretty.prettyOutput(data.verb.syn);
              } 
              else {
                synVerbs = '';
              }
              
              if (data && data.adjective && data.adjective.syn) {
                synAdj = pretty.prettyOutput(data.adjective.syn);
              } 
              else {
                synAdj = '';
              }
        }
    ).then(
        function() {
            console.log('These nouns are synonyms:\n ' + synNouns.valueOf() + '\n\nThese verbs are synonyms: \n' 
          + synVerbs.valueOf() + '\n\nOr was your word an adjective? These adjectives are synonyms: \n' 
          + synAdj.valueOf())
    }).catch(
        function(error){
            console.log("Whoops! There was a problem: " + error);
        }    
    );
}

synonym();
