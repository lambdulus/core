"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const parser_1 = require("../parser");
class Expandor {
    constructor({ parent, treeSide, target }, tree) {
        this.expanded = null;
        target.visit(this);
        if (parent === null) {
            this.tree = this.expanded;
        }
        else {
            parent[treeSide] = this.expanded;
            this.tree = tree;
        }
    }
    onApplication(application) {
        // nothing
    }
    onLambda(lambda) {
        // nothing
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
    onVariable(variable) {
        // nothing
    }
}
exports.Expandor = Expandor;
