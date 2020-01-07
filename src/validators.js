function validateRowsAndColumns(input) {
    const size = input.split(' ');
    return size.length === 2;
}

function isCyclicCellRef(input, colIndex, rowIndex) {
    const x = input.charCodeAt(0) - 65;
    const y = parseInt(input.substring(1)) - 1;
    return x === colIndex && y === rowIndex;
}

module.exports = {validateRowsAndColumns, isCyclicCellRef};