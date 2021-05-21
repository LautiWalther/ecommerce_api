module.exports.clean = (string) => {
  if(string !== "" && string !== undefined  && string !== null){
    var to_replace = /[',",`,´,]/gi;
    string = string.replace(to_replace, '');
  }
  return string;
}