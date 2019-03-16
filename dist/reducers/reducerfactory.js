"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
const reductions_1 = require("../reductions");
function constructFor(tree, nextReduction) {
    if (nextReduction instanceof reductions_1.Beta) {
        return new _1.BetaReducer(nextReduction, tree);
    }
    else if (nextReduction instanceof reductions_1.Alpha) {
        return new _1.AlphaConvertor(nextReduction, tree);
    }
    else if (nextReduction instanceof reductions_1.Expansion) {
        return new _1.Expandor(nextReduction, tree);
    }
    else {
        return new _1.EmptyReducer(tree); // for None
    }
}
exports.constructFor = constructFor;
