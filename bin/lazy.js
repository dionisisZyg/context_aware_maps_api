var path = require('path');
const fs = require('fs');

fs.readFile(path.resolve(__dirname, 'lazyFile.csv'), 'utf8', function(err, contents) {
  if (err || !contents) {
    console.error(err);
    return;
  }

  const expoded = contents.split("\n");

  const lazyString = expoded.reduce((acc, curr) => {
    if(curr){
      const sep = curr.split(";");
      if(sep.length === 4){
        return acc + `${sep[0]} & ${sep[1]} & ${sep[2]} & ${sep[3].trim()}  \\\\ \\hline \n\n`;
      }
    }

    return acc;
  }, "");

  fs.writeFile(path.resolve(__dirname, 'lazyOutput.txt'), lazyString, function (err) {
    if (err) return console.log(err);
    console.log('done');
  });
});

console.log('after calling readFile');
