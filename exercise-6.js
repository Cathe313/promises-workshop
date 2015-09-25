var request = require('request');
var Promise = require('bluebird');
var colors = require('colors');
var Table = require('cli-table');
var bhtApiKey = require('./library/thesaurus');
var pretty = require('./library/pretty');
request = Promise.promisify(request);

function getNouns(){
    return request('http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=true&includePartOfSpeech=noun&minCorpusCount=5&maxCorpusCount=-1&minDictionaryCount=20&maxDictionaryCount=-1&minLength=3&maxLength=10&limit=2&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5'
    ).spread(
        function(res, body) {
            return JSON.parse(body);
        }
    );
}

function getVerbs() {
    return request('http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=true&includePartOfSpeech=verb&minCorpusCount=5&maxCorpusCount=-1&minDictionaryCount=20&maxDictionaryCount=-1&minLength=3&maxLength=10&limit=2&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5'
    ).spread(
        function(res, body) {
            return JSON.parse(body);
        }    
    );
}

function getAdj() {
    return request('http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=true&includePartOfSpeech=adjective&minCorpusCount=5&maxCorpusCount=-1&minDictionaryCount=20&maxDictionaryCount=-1&minLength=3&maxLength=10&limit=2&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5'
    ).spread(
        function(res, body) {
            return JSON.parse(body);
        }    
    );
}



function synonym() {
    var table = new Table({
        chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
         , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
         , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
         , 'right': '║' , 'right-mid': '╢' , 'middle': '│' },
        head: ['Word', 'Synonyms: Nouns', 'Synonyms: Verbs', 'Synonyms: Adjectives'],
        colWidths: [12, 40, 40, 40]
        });
    return Promise.join(getNouns(), getVerbs(), getAdj(), function(twoNouns, twoVerbs, twoAdj){
        var arrayOfWords = [twoNouns[0].word, twoNouns[1].word, twoVerbs[0].word, twoVerbs[1].word, twoAdj[0].word, twoAdj[1].word];
        return arrayOfWords;
    }).map(
        function(word){
            return request("http://words.bighugelabs.com/api/2/" + bhtApiKey.apiKey + "/" + word + "/json"
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
                    
                    table.push(
                        [colors.rainbow(word), synNouns, synVerbs, synAdj]
                    );
                }
            );
        }
    ).then(
        function(){
            console.log(table.toString()); 
        }
    ).catch(
        function(error){
            console.log(colors.inverse("Whoops! There was a problem: " + error));
        }    
    );
    
}    

synonym();
