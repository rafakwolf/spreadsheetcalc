const assert = require('assert');
const sinon = require('sinon');
const SpreadSheet = require('../src/SpreadSheet');

describe('spreadsheet', () => {
    it('should evaluate a cell expression', () => {
        const calc = new SpreadSheet();
        const cell = {
            data: '4 5 *',
            calculated: false
        };

        const expectedResult = 4*5;

        const result = calc.cellEvaluate(cell, undefined);

        assert.strictEqual(result, expectedResult);
    });

    it('should initialize the spreadsheet matrix', () => {
        const calc = new SpreadSheet();
        calc.initialize('2 2');

        const expectedResult = [ [ '', '' ], [ '', '' ] ];

        assert.deepEqual(calc.spreadSheet.cells, expectedResult);
    });

    it('should validate the initialization input', () => {
        const calc = new SpreadSheet();
        try {
            calc.initialize('aaa');
        } catch(error) {
            const expectedResult = "\"aaa\" is an invalid spreadsheet size";
            assert.deepEqual(error.message, expectedResult);
        }
    });

    it('should retrieve a referenced cell', () => {
        const calc = new SpreadSheet();
        calc.initialize('2 1');
        const cell1 = {
            data: '10',
            calculated: false
        };
        const cell2 = {
            data: 'A1',
            calculated: false
        };

        calc.spreadSheet.cells[0][0] = cell1;
        calc.spreadSheet.cells[0][1] = cell2;

        const expectedResult = cell1.data;

        const result = calc.cellEvaluate(cell2, undefined);

        assert.strictEqual(result.toString(), expectedResult);
    });

    it('should validate a cyclic reference', () => {
        const stub = sinon.stub(process, 'exit');
        const calc = new SpreadSheet();
        calc.processUserInput('2 1');
        try {
            calc.processUserInput('A1');
        } finally {
            const called = process.exit.calledWith(-1);
            assert.strictEqual(called, true);
            stub.restore();
        }
    });
});