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
    // TODO: creating dummy token, there should be something like NoPosition
    // TODO: iterative optimization
    // recursiveApplication (n : number) : AST {
    //   if (n === 0) {
    //     return new Variable(new Token(TokenType.Identifier, 'z', {column:0,position:0,row:0}))
    //   }
    //   const left : Variable = new Variable(new Token(TokenType.Identifier, 's', {column:0,position:0,row:0}))
    //   const root : Application = new Application(left, null as any)
    //   let app : Application = root
    //   while (--n) {
    //     const left : Variable = new Variable(new Token(TokenType.Identifier, 's', {column:0,position:0,row:0}))
    //     const root : Application = new Application(left, null as any)
    //     app.right = root
    //     app = root
    //   }
    //   app.right = new Variable(new Token(TokenType.Identifier, 'z', {column:0,position:0,row:0}))
    //   return root
    // }
    // TODO: tail call recursion optimization
    // recursiveApplication (n : number) : AST {
    //   if (n === 0) {
    //     return new Variable(new Token(TokenType.Identifier, 'z', {column:0,position:0,row:0}))
    //   }
    //   const left : Variable = new Variable(new Token(TokenType.Identifier, 's', {column:0,position:0,row:0}))
    //   const root : Application = new Application(left, null as any)
    //   return this.__recursiveApplication(n - 1, root, root)
    // }
    // __recursiveApplication (n : number, accumulator : Application, root : AST) : AST {
    //   if (n === 0) {
    //     accumulator.right = new Variable(new Token(TokenType.Identifier, 'z', {column:0,position:0,row:0}))
    //     return root
    //   }
    //   const left : Variable = new Variable(new Token(TokenType.Identifier, 's', {column:0,position:0,row:0}))
    //   accumulator.right = new Application(left, null as any)
    //   return this.__recursiveApplication(n - 1, accumulator.right as Application, root)
    // }
    recursiveApplication(n) {
        if (n === 0) {
            return new ast_1.Variable(new lexer_1.Token(lexer_1.TokenType.Identifier, 'z', { column: 0, position: 0, row: 0 }));
        }
        const left = new ast_1.Variable(new lexer_1.Token(lexer_1.TokenType.Identifier, 's', { column: 0, position: 0, row: 0 }));
        const right = this.recursiveApplication(n - 1);
        return new ast_1.Application(left, right);
    }
    // TODO: creating dummy token, there should be something like NoPosition
    churchNumber(tree) {
        const s = new ast_1.Variable(new lexer_1.Token(lexer_1.TokenType.Identifier, 's', { column: 0, position: 0, row: 0 }));
        const z = new ast_1.Variable(new lexer_1.Token(lexer_1.TokenType.Identifier, 'z', { column: 0, position: 0, row: 0 }));
        const body = new ast_1.Lambda(z, tree);
        return new ast_1.Lambda(s, body);
    }
    onChurchNumber(churchNumber) {
        const value = churchNumber.token.value;
        const churchLiteral = this.churchNumber(this.recursiveApplication(value));
        this.expanded = churchLiteral;
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
