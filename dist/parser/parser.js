"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lexer_1 = require("../lexer");
const ast_1 = require("../ast");
class Parser {
    constructor(tokens, macroTable) {
        this.tokens = tokens;
        this.macroTable = macroTable;
        this.position = 0;
        this.openSubexpressions = 0;
    }
    isMacro(token) {
        return token.value in this.macroTable;
    }
    top() {
        return this.tokens[this.position];
    }
    canAccept(type) {
        return (this.position < this.tokens.length
            &&
                this.top().type == type);
    }
    accept(type) {
        if (!this.canAccept(type)) {
            throw "Was expecting " + type;
        }
        const top = this.top();
        this.position++;
        return top;
    }
    acceptClosing() {
        if (this.canAccept(lexer_1.TokenType.RightParen)) {
            this.openSubexpressions--;
            this.accept(lexer_1.TokenType.RightParen);
            return;
        }
        if (this.canAccept(lexer_1.TokenType.RightBracket)) {
            if (this.openSubexpressions > 1) {
                this.openSubexpressions--;
                return;
            }
            else {
                this.openSubexpressions--;
                this.accept(lexer_1.TokenType.RightBracket);
                return;
            }
        }
        throw "Was expecting `)` or `]`";
    }
    exprEnd() {
        return (this.position === this.tokens.length
            ||
                this.top().type === lexer_1.TokenType.RightParen
            ||
                this.top().type === lexer_1.TokenType.RightBracket);
    }
    eof() {
        return this.position === this.tokens.length;
    }
    parseLambda() {
        if (this.canAccept(lexer_1.TokenType.Dot)) {
            this.accept(lexer_1.TokenType.Dot);
            return this.parse(null); // λ body
        }
        if (this.canAccept(lexer_1.TokenType.Identifier)) {
            const id = this.accept(lexer_1.TokenType.Identifier);
            const argument = new ast_1.Variable(id);
            const body = this.parseLambda();
            return new ast_1.Lambda(argument, body);
        }
        throw "Was expecting either `.` or some Identifier, but got " + this.top().type;
    }
    // parseLambda () : AST {
    //   const top : Token = this.top()
    //   switch (top.type) {
    //     case TokenType.Dot:
    //       this.accept(TokenType.Dot)
    //       return this.parse(null) // λ body
    //     case TokenType.Identifier:
    //       this.accept(TokenType.Identifier)
    //       const argument : Variable = new Variable(top)
    //       const body : AST = this.parseLambda()
    //       return new Lambda(argument, body)
    //     default:
    //       throw "Some invalid token error"
    //   }
    // }
    /**
     * SINGLE
         := number
         := operator
         := ident
         := '(' λ ident { ident } '.' LEXPR ')'
         := '(' LEXPR ')'
     */
    parseExpression() {
        if (this.canAccept(lexer_1.TokenType.Number)) {
            const num = this.accept(lexer_1.TokenType.Number);
            return new ast_1.ChurchNumber(num);
        }
        if (this.canAccept(lexer_1.TokenType.Operator)) {
            const op = this.accept(lexer_1.TokenType.Operator);
            return new ast_1.Macro(op, this.macroTable[op.value]);
        }
        if (this.canAccept(lexer_1.TokenType.Identifier)) {
            const id = this.accept(lexer_1.TokenType.Identifier);
            if (this.isMacro(id)) {
                return new ast_1.Macro(id, this.macroTable[id.value]);
            }
            return new ast_1.Variable(id);
        }
        if (this.canAccept(lexer_1.TokenType.LeftParen)) {
            this.accept(lexer_1.TokenType.LeftParen);
            this.openSubexpressions++;
            if (this.canAccept(lexer_1.TokenType.Lambda)) {
                this.accept(lexer_1.TokenType.Lambda);
                const id = this.accept(lexer_1.TokenType.Identifier);
                const argument = new ast_1.Variable(id);
                const body = this.parseLambda();
                const lambda = new ast_1.Lambda(argument, body);
                this.acceptClosing();
                // this.accept(TokenType.RightParen)
                // this.openSubexpressions--
                return lambda;
            }
            else { // ( LEXPR )
                const expr = this.parse(null);
                this.acceptClosing();
                // this.accept(TokenType.RightParen)
                // this.openSubexpressions--
                return expr;
            }
        }
        throw "Was expecting one of: Number, Operator, Identifier or `(` but got " + this.top().type;
    }
    // parseExpression () : AST {
    //   let top : Token = this.top()
    //   switch (top.type) {
    //     case TokenType.Number:
    //       this.accept(TokenType.Number)
    //       return new ChurchNumber(top)
    //     case TokenType.Operator:
    //       this.accept(TokenType.Operator)
    //       return new Macro(top, this.macroTable[top.value])
    //     case TokenType.Identifier:
    //       this.accept(TokenType.Identifier)
    //       if (this.isMacro(top)) {
    //         return new Macro(top, this.macroTable[top.value])
    //       }
    //       return new Variable(top)
    //     case TokenType.LeftParen:
    //       this.accept(TokenType.LeftParen)
    //       // TODO: kdyz top uz neni
    //       // mel bych zavest nejakou logiku acceptAny nebo acceptAnyOf
    //       // hlavni je aby v pripade ze top je prazdny aby to thrownulo s informaci co jsem ocekaval
    //       top = this.top()
    //       if (top.type === TokenType.Lambda) {
    //         this.accept(TokenType.Lambda)
    //         top = this.top()
    //         this.accept(TokenType.Identifier)
    //         const argument : Variable = new Variable(top)
    //         const body : AST = this.parseLambda()
    //         const lambda : AST = new Lambda(argument, body)
    //         this.accept(TokenType.RightParen)
    //         return lambda
    //       }
    //       else {
    //         // ( LEXPR )
    //         const expr : AST = this.parse(null)
    //         this.accept(TokenType.RightParen)
    //         return expr
    //       }
    //     default:
    //       throw "Some syntax error"
    //   }
    // }
    /**
     * LEXPR := SINGLE { SINGLE }
     */
    parse(leftSide) {
        if (this.exprEnd()) {
            // TODO: taky by bylo fajn rict, kde
            if (this.eof() && this.openSubexpressions !== 0) {
                throw "It seems like you forgot to write one or more closing parentheses.";
            }
            if (leftSide === null) {
                throw "You are trying to parse empty expression, which is forbidden. " +
                    "Check your λ expression for empty perenthesis.";
            }
            return leftSide;
            // TODO: lefSide should never ever happen to be null -> check again
            // TODO: it can be empty if parsing `( )`
            // could it be caught by simply checking if leftSide is never null in this place?
        }
        else {
            const expr = this.parseExpression();
            if (leftSide === null) {
                return this.parse(expr);
            }
            else {
                const app = new ast_1.Application(leftSide, expr);
                return this.parse(app);
            }
        }
    }
}
exports.Parser = Parser;
