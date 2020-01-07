const _ = require('lodash');

let spreadSheet = {
    cells: [],
    initialized: false
};

/**
 * @param {Object} cell
 * @param {Object[]} currentStack
 */
function cellEvaluate(cell, currentStack) {
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
                    contents.push(contents.pop() / contents.pop());
                }
                else if (value === "-") {
                    contents.push(contents.pop() - contents.pop());
                }
                else if (!isNaN(parseInt(value))) {
                    contents.push(parseFloat(value));
                }
                else {
                    const refCell = getReferencedCell(value);

                    if (_.isEqual(cell, refCell)) {
                        console.log('Cyclic dependencies in the input data');
                        process.exit(-1);
                    }

                    contents.push(cellEvaluate(refCell, currentStack));
                }
            }

            cell.value = contents.pop();
            cell.calculated = true;
        } catch (error) {
            console.log('error', JSON.stringify(error, undefined, 2));
            process.exit(-1);
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
function getReferencedCell(value) {
    const x = value.charCodeAt(0) - 65;
    const y = parseInt(value.substring(1));
    return spreadSheet.cells[x][y];
}

/**
 * @param {number} rowsCount
 * @param {number} columnsCount
 */
function evaluateCells(rowsCount, columnsCount) {
    for (let i = 0; i < rowsCount; i++) {
        for (let j = 0; j < columnsCount; j++) {
            cellEvaluate(spreadSheet.cells[i][j], undefined);
        }
    }
}

module.exports = {
    evaluateCells,
    spreadSheet
};