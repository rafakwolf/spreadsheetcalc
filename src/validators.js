function validateRowsAndColumns(input) {
    const size = input.split(' ');
    return size.length === 2;
}

module.exports = {validateRowsAndColumns};