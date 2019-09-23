"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ast_1 = require("../ast");
const visitors_1 = require("../visitors");
const lexer_1 = require("../lexer");
class GamaReducer extends visitors_1.ASTVisitor {
    constructor({ redexes, args, parent, treeSide, abstraction }, tree) {
        super();
        this.tree = tree;
        this.substituted = null;
        this.redexes = redexes;
        this.args = args;
        this.parent = parent;
        this.treeSide = treeSide;
        this.abstraction = abstraction;
        this.tree = tree;
    }
    perform() {
        const [name] = this.abstraction;
        const target = this.redexes[this.redexes.length - 1]; // last node, must by APP
        const [_, evaluation] = GamaReducer.knownAbstraction[name];
        this.substituted = evaluation(this.args);
        if (this.parent === null) {
            this.tree = this.substituted;
        }
        else {
            this.parent[this.treeSide] = this.substituted;
        }
    }
    static assertReduction({ redexes, args, parent, treeSide, abstraction }) {
        const [name] = abstraction;
        if (!(name in this.knownAbstraction)) {
            return false;
        }
        const [assertion] = this.knownAbstraction[name];
        return assertion(args);
    }
}
exports.GamaReducer = GamaReducer;
//                                               validator evaluator
GamaReducer.knownAbstraction = {
    'ZERO': [() => true, () => { }],
    'PRED': [() => true, () => { }],
    'SUC': [() => true, () => { }],
    'AND': [() => true, () => { }],
    'OR': [() => true, () => { }],
    'NOT': [() => true, () => { }],
    '+': [() => true, (args) => {
            const [first, second] = args;
            const value = Number(first.name()) + Number(second.name());
            const dummyToken = new lexer_1.Token(lexer_1.TokenType.Number, `${value}`, lexer_1.BLANK_POSITION);
            return new ast_1.ChurchNumeral(dummyToken);
        }],
    '-': [() => true, () => { }],
    '*': [() => true, () => { }],
    '/': [() => true, () => { }],
    '^': [() => true, () => { }],
    'DELTA': [() => true, () => { }],
    '=': [() => true, () => { }],
    '>': [() => true, () => { }],
    '<': [() => true, () => { }],
    '>=': [() => true, () => { }],
    '<=': [() => true, () => { }],
};
