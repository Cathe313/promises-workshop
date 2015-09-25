function prettyOutput(synArray) {
  return synArray.map(function(i){
    return (' ' + i);
  });
}

module.exports = {
    prettyOutput: prettyOutput
}