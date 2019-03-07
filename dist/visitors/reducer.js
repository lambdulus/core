"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expandor_1 = require("./expandor");
const betareducer_1 = require("./betareducer");
const alphaconvertor_1 = require("./alphaconvertor");
class Reducer {
    constructor(tree, nextReduction) {
        this.tree = tree;
        this.nextReduction = nextReduction;
        nextReduction.visit(this);
    }
    onAlpha(alpha) {
        // const { tree, child, oldName, newName } = alpha
        const alphaConvertor = new alphaconvertor_1.AlphaConvertor(alpha);
        // tree[<Child> child] = tree[<Child> child].alphaConvert(oldName, newName)
    }
    onBeta(beta) {
        // const { parent, treeSide, target, argName, value } = beta
        const betaReducer = new betareducer_1.BetaReducer(beta, this.tree);
        this.tree = betaReducer.tree;
        // const substituted : AST = target.betaReduce(argName, value)
        // if (parent === null) {
        //   this.tree = substituted
        // }
        // else {
        //   parent[<Child> treeSide] = substituted
        // }
    }
    onExpansion(expansion) {
        // const { parent, treeSide, target } = expansion
        const expander = new expandor_1.Expandor(expansion, this.tree);
        this.tree = expander.tree;
        // const expanded : AST = target.expand()
        // if (parent === null) {
        //   this.tree = expanded
        // }
        // else {
        //   parent[<Child> treeSide] = expanded
        // }
    }
    onNone(none) {
        // nothing
    }
}
exports.Reducer = Reducer;
