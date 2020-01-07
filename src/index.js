const readline = require('readline');
const { validateRowsAndColumns } = require('./validators');
const { evaluateCells, spreadSheet } = require('./SpreadSheet');

Array.matrix = function(numRows, numCols, initial) {
    let arr = [];
    for (let i = 0; i < numRows; ++i) {
        let columns = [];
        for (let j = 0; j < numCols; ++j) {
            columns[j] = initial;
        }
        arr[i] = columns;
    }
    return arr;
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

let rowIndex = 0;
let colIndex = 0;
let cellCount = 0;
let rowsCount = 0;
let columnsCount = 0;

rl.on('line', function(line) {
    if (!spreadSheet.initialized) {
        if (!validateRowsAndColumns(line)) {
            console.error(`"${line}" is an invalid spreadsheet size`);
        }
    
        const sizes = line.split(' ');
        columnsCount = parseInt(sizes[0], 10);
        rowsCount = parseInt(sizes[1], 10);
    
        spreadSheet.cells = Array.matrix(rowsCount, columnsCount, '');
    
        console.log(`The spreadsheet contain ${columnsCount} columns and ${rowsCount} rows`);

        spreadSheet.initialized = true;
        line = '';
    }

    if (line && (cellCount < (columnsCount * rowsCount))) {
        spreadSheet.cells[rowIndex][colIndex] = { data: line };
        cellCount++;
        colIndex++;

        if(colIndex === columnsCount)
        {
            colIndex = 0;
            rowIndex++;
        }
    }

    if (cellCount !== (columnsCount * rowsCount)) {
        console.log(`Enter the value of cell ${rowIndex}:${colIndex}`);
    }

    if (cellCount === (columnsCount * rowsCount))
    {
        evaluateCells(rowsCount, columnsCount);

		for (let i = 0; i < rowsCount; i++) {
			for (let j = 0; j < columnsCount; j++) {
                console.log(`${i}:${j}`, spreadSheet.cells[i][j].value);
			}
		}
    }
});
