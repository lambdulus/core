"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const visitors_1 = require("../visitors");
const parser_1 = require("../parser");
// import { Reducer } from "./emptyreducer";
class Expandor extends visitors_1.ASTVisitor {
    constructor({ parent, treeSide, target }, tree) {
        super();
        this.tree = tree;
        this.expanded = null;
        this.parent = parent;
        this.treeSide = treeSide;
        this.target = target;
    }
    onChurchNumber(churchNumber) {
        const codeStyle = { singleLetterVars: true, lambdaLetters: ['λ'] };
        const value = churchNumber.token.value;
        const churchLiteral = `(λ s z .${' (s'.repeat(value)} z)${')'.repeat(value)}`;
        this.expanded = parser_1.parse(__1.Lexer.tokenize(churchLiteral, codeStyle));
    }
    onMacro(macro) {
        // TODO: here I lose token - useful for location and origin of macro - should solve this
        // also consider not clonning
        this.expanded = macro.definition.ast.clone();
    }
    perform() {
        this.target.visit(this);
        if (this.parent === null) {
            this.tree = this.expanded;
        }
        else {
            this.parent[this.treeSide] = this.expanded;
        }
    }
}
exports.Expandor = Expandor;
