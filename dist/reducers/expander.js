"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lexer_1 = require("../lexer");
const ast_1 = require("../ast");
const visitors_1 = require("../visitors");
class Expander extends visitors_1.ASTVisitor {
    constructor({ parent, treeSide, target }, tree) {
        super();
        this.tree = tree;
        this.expanded = null;
        this.parent = parent;
        this.treeSide = treeSide;
        this.target = target;
    }
    onChurchNumeralBody(n) {
        if (n === 0) {
            return new ast_1.Variable(new lexer_1.Token(lexer_1.TokenType.Identifier, 'z', lexer_1.BLANK_POSITION));
        }
        const left = new ast_1.Variable(new lexer_1.Token(lexer_1.TokenType.Identifier, 's', lexer_1.BLANK_POSITION));
        const right = this.onChurchNumeralBody(n - 1);
        return new ast_1.Application(left, right);
    }
    // TODO: creating dummy token, there should be something like NoPosition
    onChurchNumeralHeader(tree) {
        const s = new ast_1.Variable(new lexer_1.Token(lexer_1.TokenType.Identifier, 's', lexer_1.BLANK_POSITION));
        const z = new ast_1.Variable(new lexer_1.Token(lexer_1.TokenType.Identifier, 'z', lexer_1.BLANK_POSITION));
        const body = new ast_1.Lambda(z, tree);
        return new ast_1.Lambda(s, body);
    }
    onChurchNumeral(churchNumeral) {
        const value = churchNumeral.token.value;
        const churchLiteral = this.onChurchNumeralHeader(this.onChurchNumeralBody(value));
        this.expanded = churchLiteral;
    }
    onMacro(macro) {
        // TODO: here I lose token - useful for location and origin of macro - should solve this
        // also consider not clonning - not good idea because of breakpoints - right?
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
exports.Expander = Expander;