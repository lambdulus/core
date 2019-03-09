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
        const alphaConvertor = new alphaconvertor_1.AlphaConvertor(alpha);
    }
    onBeta(beta) {
        const betaReducer = new betareducer_1.BetaReducer(beta, this.tree);
        this.tree = betaReducer.tree;
    }
    onExpansion(expansion) {
        const expander = new expandor_1.Expandor(expansion, this.tree);
        this.tree = expander.tree;
    }
    onNone(none) {
        // nothing
    }
}
exports.Reducer = Reducer;
