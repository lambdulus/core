"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lexer_1 = require("../lexer");
const ast_1 = require("../ast");
class Parser {
    constructor(tokens, macroTable) {
        this.tokens = tokens;
        this.macroTable = macroTable;
        this.position = 0;
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
            throw "Some Invalid token error";
        }
        this.position++;
    }
    exprEnd() {
        return (this.position === this.tokens.length
            ||
                this.top().type === lexer_1.TokenType.RightParen);
    }
    parseLambda() {
        const top = this.top();
        switch (top.type) {
            case lexer_1.TokenType.Dot:
                this.accept(lexer_1.TokenType.Dot);
                return this.parse(null); // λ body
            case lexer_1.TokenType.Identifier:
                this.accept(lexer_1.TokenType.Identifier);
                const argument = new ast_1.Variable(top);
                const body = this.parseLambda();
                return new ast_1.Lambda(argument, body);
            default:
                throw "Some invalid token error";
        }
    }
    /**
     * SINGLE
         := number
         := operator
         := ident
         := '(' λ ident { ident } '.' LEXPR ')'
         := '(' LEXPR ')'
     */
    parseExpression() {
        let top = this.top();
        switch (top.type) {
            case lexer_1.TokenType.Number:
                this.accept(lexer_1.TokenType.Number);
                return new ast_1.ChurchNumber(top);
            case lexer_1.TokenType.Operator:
                this.accept(lexer_1.TokenType.Operator);
                return new ast_1.Macro(top, this.macroTable[top.value]);
            case lexer_1.TokenType.Identifier:
                this.accept(lexer_1.TokenType.Identifier);
                if (this.isMacro(top)) {
                    return new ast_1.Macro(top, this.macroTable[top.value]);
                }
                return new ast_1.Variable(top);
            case lexer_1.TokenType.LeftParen:
                this.accept(lexer_1.TokenType.LeftParen);
                top = this.top();
                if (top.type === lexer_1.TokenType.Lambda) {
                    this.accept(lexer_1.TokenType.Lambda);
                    top = this.top();
                    this.accept(lexer_1.TokenType.Identifier);
                    const argument = new ast_1.Variable(top);
                    const body = this.parseLambda();
                    const lambda = new ast_1.Lambda(argument, body);
                    this.accept(lexer_1.TokenType.RightParen);
                    return lambda;
                }
                else {
                    // ( LEXPR )
                    const expr = this.parse(null);
                    this.accept(lexer_1.TokenType.RightParen);
                    return expr;
                }
            default:
                throw "Some syntax error";
        }
    }
    /**
     * LEXPR := SINGLE { SINGLE }
     */
    parse(leftSide) {
        if (this.exprEnd()) {
            return leftSide; // TODO: lefSide should never ever happen to be null -> check again
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
