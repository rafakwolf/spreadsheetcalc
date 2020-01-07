const readline = require('readline');
const SpreadSheet = require('./SpreadSheet');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

const spreadSheetCalc = new SpreadSheet();

rl.on('line', function(line) {
    spreadSheetCalc.processUserInput(line);
});
