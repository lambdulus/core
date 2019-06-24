"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lexer_1 = require("../lexer");
const _1 = require("./");
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
    canAcceptClosing() {
        return (this.top().type === lexer_1.TokenType.RightParen
            ||
                this.top().type === lexer_1.TokenType.RightBracket);
    }
    allClosed() {
        return this.openSubexpressions === 0;
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
    /**
     * SINGLE
         := number
         := operator
         := ident
         := ( λ ident { ident } . LEXPR )
         := ( LEXPR )
         := '( LEXPR )
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
                return lambda;
            }
            else { // ( LEXPR )
                const expr = this.parse(null);
                this.acceptClosing();
                return expr;
            }
        }
        if (this.canAccept(lexer_1.TokenType.Quote)) {
            this.accept(lexer_1.TokenType.Quote);
            this.accept(lexer_1.TokenType.LeftParen);
            this.openSubexpressions++;
            const expr = this.parseQuoted();
            this.acceptClosing();
            return expr;
        }
        throw "Was expecting one of: Number, Operator, Identifier or `(` but got " + this.top().type;
    }
    /**
     * LEXPR := SINGLE { SINGLE }
     */
    parse(leftSide) {
        if (!this.eof() && this.canAcceptClosing() && this.allClosed()) {
            throw "It seems you have one or more closing parenthesis not matching.";
        }
        if (this.eof() && this.openSubexpressions !== 0) {
            throw "It seems like you forgot to write one or more closing parentheses.";
        }
        if (this.exprEnd()) {
            // if (! this.eof() && this.openSubexpressions === 0) {
            //   throw "It seems you have one or more closing parenthesis non matching."
            // }
            // TODO: throw new MissingParenError(position)
            // if (this.eof() && this.openSubexpressions !== 0) {
            //   throw "It seems like you forgot to write one or more closing parentheses."
            // }
            if (leftSide === null) {
                // TODO: log position and stuff
                throw "You are trying to parse empty expression, which is forbidden. " +
                    "Check your λ expression for empty perenthesis. " + this.position;
            }
            return leftSide;
            // TODO: lefSide should never ever happen to be null -> check again
            // TODO: it can be empty if parsing `( )` - handled
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
    parseQuoted() {
        if (this.exprEnd()) {
            if (!this.eof() && this.openSubexpressions === 0) {
                throw "It seems you have one or more closing parenthesis non matching.";
            }
            if (this.eof() && this.openSubexpressions !== 0) {
                throw "It seems like you forgot to write one or more closing parentheses.";
            }
            return _1.parse([new lexer_1.Token(lexer_1.TokenType.Identifier, 'NIL', lexer_1.BLANK_POSITION)], {});
        }
        else {
            // TODO: There would be real fun if I used parser itself to handle two of the applications.
            // like return Parser.parse(`${this.parseExpression()} CONS ${this.parseQuoted}`)
            const expr = this.parseExpression();
            const left = _1.parse([new lexer_1.Token(lexer_1.TokenType.Identifier, 'CONS', lexer_1.BLANK_POSITION)], {});
            const app = new ast_1.Application(left, expr);
            return new ast_1.Application(app, this.parseQuoted());
        }
    }
}
exports.Parser = Parser;
