function Matilde (inputData) {

    this.reset = function () {
        this._input = null;
        this.chunks = [];
        this.sortChunks = [];
        this.tree = {};
    };
    this.init = function (inputValues) {
        this.reset();
        this._input = inputValues;
        this.map(this._input, this.tree);
        return this;
    };
    this.map = function (value, FOP) {
        var me = this;
        return Array.prototype.map.call(value, function (item) {
            // Nesting
            if (typeof item === 'object' && item.length) {

                if (!FOP.FOP) {
                    FOP.FOP = {};
                }
                me.chunks.push('FOP~0~(~0');
                me.map(item, FOP.FOP);
                me.chunks.push('FCP~0~)~0');
            } else if (item) {

                var filterType;

                if (item.values && item.values.length) {
                    filterType = 'FBL';
                    // overwrite qualifier if using values instead of value (split on ,)
                    item.qualifier = 'INN';
                } else {
                    filterType = 'FBV';
                    // Handle wildcards for LK qualifier
                    if (item.qualifier === 'LK') {
                        item.value += encodeURIComponent('%');
                        // if FBL/INN can use wildcards handle that here too
                    }
                }
                if (item.op && item.op.toLowerCase() === 'or') {
                    filterType += 'OR';
                }

                // handle sorts
                if (item.sort) {
                    if (item.sort !== 'ASC' && item.sort !== 'DESC') {
                        // default sorting desc;
                        item.sort = 'DESC';
                    }
                    var tempSortString = ['FSF', item.prop, item.sort, '0'].join('~');
                    me.sortChunks.push(tempSortString);
                    // sort goes at root of tree
                    if (!me.tree.FSF) {
                        me.tree.FSF = {};
                    }
                    me.tree.FSF[item.prop] = item.sort;
                }
                var filter = [filterType, item.prop, item.qualifier, (item.value || item.values.join(','))];
                if (!FOP[filterType]) {
                    FOP[filterType] = {};
                }

                FOP[filterType][item.prop] = [item.qualifier, (item.value || item.values.join(','))].join('~');

                me.chunks.push(filter.join('~'));
            }
        });
    };
    if (inputData) {
        this.init(inputData);

    }
    return this;
}

Matilde.prototype.toString = function () {
    if (this.chunks.length) {
        // merge chunks with sortChunks
        return this.chunks.concat(this.sortChunks).join('~');
    } else if (!this._input){
        throw new Error('no input');
    }
};
module.exports = Matilde;
