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

var testData2 = [
    {
        prop: 'ID',
        qualifier: 'EQ',
        value: '99'
    },
    [
        {
            prop: 'Role',
            qualifier: 'GT',
            value: '2',
            op: 'OR'
        }, {
            prop: 'Fruit',
            qualifier: 'LK',
            value: 'Apple',
            op: 'OR',
            sort: true
        },
        [
            {
                prop: 'Food',
                qualifier: 'INN',
                values: ['Pizza', 'Hamburger']
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
        console.log('     has this many', tildeLength);
        assert.equal(tildeLength > insaneAmount, true);
    });
    describe('feeding new dataset', function () {
        it('should be able to feed a new dataset into an existing matilde', function () {
            assert.equal(data.init(testData2).toString(), 'FBV~ID~EQ~99~FOP~0~(~0~FBVOR~Role~GT~2~FBVOR~Fruit~LK~Apple%25~FOP~0~(~0~FBL~Food~INN~Pizza,Hamburger~FCP~0~)~0~FCP~0~)~0~FSF~Fruit~DESC~0');
        });
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
