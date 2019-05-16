"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lexer_1 = require("../lexer");
const ast_1 = require("../ast");
const visitors_1 = require("../visitors");
class Expandor extends visitors_1.ASTVisitor {
    constructor({ parent, treeSide, target }, tree) {
        super();
        this.tree = tree;
        this.expanded = null;
        this.parent = parent;
        this.treeSide = treeSide;
        this.target = target;
    }
    churchNumberBody(n) {
        if (n === 0) {
            return new ast_1.Variable(new lexer_1.Token(lexer_1.TokenType.Identifier, 'z', { column: 0, position: 0, row: 0 }));
        }
        const left = new ast_1.Variable(new lexer_1.Token(lexer_1.TokenType.Identifier, 's', { column: 0, position: 0, row: 0 }));
        const right = this.churchNumberBody(n - 1);
        return new ast_1.Application(left, right);
    }
    // TODO: creating dummy token, there should be something like NoPosition
    churchNumberHeader(tree) {
        const s = new ast_1.Variable(new lexer_1.Token(lexer_1.TokenType.Identifier, 's', { column: 0, position: 0, row: 0 }));
        const z = new ast_1.Variable(new lexer_1.Token(lexer_1.TokenType.Identifier, 'z', { column: 0, position: 0, row: 0 }));
        const body = new ast_1.Lambda(z, tree);
        return new ast_1.Lambda(s, body);
    }
    onChurchNumber(churchNumber) {
        const value = churchNumber.token.value;
        const churchLiteral = this.churchNumberHeader(this.churchNumberBody(value));
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
exports.Expandor = Expandor;
