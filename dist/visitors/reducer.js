"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const expandor_1 = require("./expandor");
const betareducer_1 = require("./betareducer");
const alphaconvertor_1 = require("./alphaconvertor");
class Reducer extends _1.ASTVisitor {
    constructor(tree) {
        super();
        this.tree = tree;
    }
    static constructFor(tree, nextReduction) {
        if (nextReduction instanceof _1.Reductions.Beta) {
            return new betareducer_1.BetaReducer(nextReduction, tree);
        }
        else if (nextReduction instanceof _1.Reductions.Alpha) {
            return new alphaconvertor_1.AlphaConvertor(nextReduction, tree);
        }
        else if (nextReduction instanceof _1.Reductions.Expansion) {
            return new expandor_1.Expandor(nextReduction, tree);
        }
        else {
            // throw new Error('There are no Reduction implementations for type' + nextReduction.toString())
            // or
            return new Reducer(tree);
        }
    }
    perform() {
        // nothing
    }
}
exports.default = Reducer;
