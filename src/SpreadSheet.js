const _ = require('lodash');
const {validateRowsAndColumns, isCyclicCellRef} = require('./validators');

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

function getLetter(charCode) {
  return String.fromCharCode(94 + (charCode + 3)).toUpperCase();
}

class SpreadSheet {
    constructor() {
        this.spreadSheet = {
            cells: [],
            initialized: false
        };
        this.rowIndex = 0;
        this.colIndex = 0;
        this.cellCount = 0;
        this.rowsCount = 0;
        this.columnsCount = 0;
        this.initialized = false;
        console.log("Please, enter the number of columns and rows, e.g. (2 2).");
    }

    initialize(input) {
        if (!this.initialized) {
            if (!validateRowsAndColumns(input)) {
                throw new Error(`"${input}" is an invalid spreadsheet size`);
            }

            const sizes = input.split(' ');
            this.columnsCount = parseInt(sizes[0], 10);
            this.rowsCount = parseInt(sizes[1], 10);

            this.spreadSheet.cells = Array.matrix(this.rowsCount, this.columnsCount, '');

            console.log(`The spreadsheet contain ${this.columnsCount} columns and ${this.rowsCount} rows`);
        }
    }

    /**
     * @param {string} input
     */
    processUserInput(input) {
        if (!this.initialized) {
            this.initialize(input);
            input = '';
            this.initialized = true;
        }

        if (isCyclicCellRef(input, this.colIndex, this.rowIndex)) {
            console.log('Cyclic dependencies in the input data.');
            process.exit(-1);
        }

        if (input && (this.cellCount < (this.columnsCount * this.rowsCount))) {
            this.spreadSheet.cells[this.rowIndex][this.colIndex] = { data: input };

            this.cellCount++;
            this.colIndex++;

            if(this.colIndex === this.columnsCount)
            {
                this.colIndex = 0;
                this.rowIndex++;
            }
        }

        if (this.cellCount !== (this.columnsCount * this.rowsCount)) {
            console.log(`Enter the value of cell ${getLetter(this.rowIndex)}:${this.colIndex + 1}`);
        }

        if (this.cellCount === (this.columnsCount * this.rowsCount))
        {
            this.evaluateCells(this.rowsCount, this.columnsCount);

            for (let i = 0; i < this.rowsCount; i++) {
                for (let j = 0; j < this.columnsCount; j++) {
                    console.log(`${getLetter(i)}:${j+1}`, this.spreadSheet.cells[i][j].value);
                }
            }
        }
    }

    /**
     * @param {Object} cell
     * @param {Object[]} currentStack
     */
     cellEvaluate(cell, currentStack) {
        if (!currentStack) {
            currentStack = [];
        }

        if (cell.calculated) {
        }
        else if (!cell.calculated && !_.includes(currentStack, cell.data)) {
            try {
                currentStack.push(cell);

                const cellParts = cell.data.split(' ');
                const contents = [];

                for (let index = 0; index < cellParts.length; index++) {
                    const value = cellParts[index];

                    if (value === "+") {
                        contents.push(contents.pop() + contents.pop());
                    }
                    else if (value === "*") {
                        contents.push(contents.pop() * contents.pop());
                    }
                    else if (value === "/") {
                        const value1 = parseFloat(contents.pop());
                        const value2 = parseFloat(contents.pop());
                        contents.push(value2 / value1);
                    }
                    else if (value === "-") {
                        const value1 = parseFloat(contents.pop());
                        const value2 = parseFloat(contents.pop());
                        contents.push(value2 - value1);
                    }
                    else if (!isNaN(parseInt(value))) {
                        contents.push(parseFloat(value));
                    }
                    else {
                        const refCell = this.getReferencedCell(value);
                        contents.push(this.cellEvaluate(refCell, currentStack));
                    }
                }

                cell.value = contents.pop();
                cell.calculated = true;
            } catch (error) {
                console.log(error.message);
                process.exit(-2);
            }
        } else {
            console.log('Something went wrong :(');
            process.exit();
        }
        return cell.value;
    }

    /**
     * @param {string} value
     */
    getReferencedCell(value) {
        const x = value.charCodeAt(0) - 65;
        const y = parseInt(value.substring(1)) - 1;
        return this.spreadSheet.cells[x][y];
    }

    /**
     * @param {number} rowsCount
     * @param {number} columnsCount
     */
    evaluateCells(rowsCount, columnsCount) {
        for (let i = 0; i < rowsCount; i++) {
            for (let j = 0; j < columnsCount; j++) {
                this.cellEvaluate(this.spreadSheet.cells[i][j], undefined);
            }
        }
    }
}

module.exports = SpreadSheet;