var chai = require('chai');
var Matilde = require('./Matilde/matilde');
var assert = chai.assert;

var testData1 = [
    {
        prop: 'ID',
        qualifier: 'EQ',
        value: '1'
    },
    [
        {
            prop: 'Role',
            qualifier: 'LE',
            value: '4',
            op: 'OR'
        }, {
            prop: 'FirstName',
            qualifier: 'LK',
            value: 'Cesar',
            op: 'OR',
            sort: true
        },
        [
            {
                prop: 'LastName',
                qualifier: 'INN',
                values: ['Chavez', 'Vargas']
            }
        ]
    ]
];

var data = new Matilde(testData1);

describe('Matilde', function() {
    it('should return a string representation of the input data', function() {
        assert.equal(data.toString(), 'FBV~ID~EQ~1~FOP~0~(~0~FBVOR~Role~LE~4~FBVOR~FirstName~LK~Cesar%25~FOP~0~(~0~FBL~LastName~INN~Chavez,Vargas~FCP~0~)~0~FCP~0~)~0~FSF~FirstName~DESC~0');
    });
    it('should have 8 chunks', function() {
        assert.equal(data.chunks.length, 8);
    });
    it('should properly use \'OR\' operator', function () {
        assert.equal(data.tree.FOP.hasOwnProperty('FBVOR'), true);
    });
    it('should add wildcard (%) if qualifier is \'LK\'', function () {
        assert.equal(data.tree.FOP.FBVOR.FirstName.indexOf('%25') > -1, true);
    });
    it('~should~have~an~insane~amount~of~tildes~!', function () {
        var insaneAmount = 3;
        var tildeLength = data.toString().split('~').length;
        console.log('     has dis many', tildeLength);
        assert.equal(tildeLength > insaneAmount, true);
    });
    describe('as a tree', function() {
        it('should have proper nesting', function() {
            var tempLevels = 0;
            function getLevels(level) {
                var tempKeys = Object.keys(level);
                tempKeys.forEach(function(key) {
                    if (key === 'FOP') {
                        tempLevels++;
                        getLevels(level[key]);
                    }
                });
            }
            getLevels(data.tree);

            var levels = 0;
            function countLevels(input) {
                return input.forEach(function (level) {
                    if (level.length) {
                        levels++;
                        countLevels(level);
                    }
                });
            }
            countLevels(data._input);
            assert.equal(tempLevels, levels);
        });
        it ('should have sort filters', function () {
            var sorts = [];
            function hasSorting(input) {
                return input.forEach(function (level) {
                    if (level.length) {
                        hasSorting(level);
                    }
                    if (level.hasOwnProperty('sort')) {
                        sorts.push(level.prop);
                    }
                });
            }
            hasSorting(data._input);
            assert.equal(Object.keys(data.tree.FSF).length, sorts.length);
        });
    });
});
