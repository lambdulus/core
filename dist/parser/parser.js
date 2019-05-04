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
                return lambda;
            }
            else { // ( LEXPR )
                const expr = this.parse(null);
                this.acceptClosing();
                return expr;
            }
        }
        throw "Was expecting one of: Number, Operator, Identifier or `(` but got " + this.top().type;
    }
    /**
     * LEXPR := SINGLE { SINGLE }
     */
    parse(leftSide) {
        // TODO: refactor error catching - this if if if is insane
        // TODO: uvaha
        // pokud se nachazim na top level urovni a narazim na zaviraci zavorku
        // striktne receno - pokud je pocet mejch otevrenejch zavorek 0
        // a narazim na zaviraci zavorku, tak je neco spatne
        if (this.exprEnd()) {
            if (!this.eof() && this.openSubexpressions === 0) {
                throw "It seems you have one or more closing parenthesis non matching.";
            }
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
            // mohl bych `` treatovat jako zavorky, akorat se syntaktickym vyznamem, takze bych je proste pridal
            // do gramatiky - otevrou a uzavrou expression, do AST by se ale nedostaly
            // takze bych je musel identifikovat uz pred ASTckem
            // let isInfix : boolean = this.canAccept(TokenType.BackTick)
            // if (isInfix) {
            // this.accept(TokenType.BackTick)
            // }
            const expr = this.parseExpression();
            // if (isInfix) {
            // this.accept(TokenType.BackTick)
            // }
            if (leftSide === null) {
                return this.parse(expr);
            }
            else {
                // if (isInfix) {
                //   const app : AST = new Application(expr, leftSide)
                //   return this.parse(app)
                // }
                // else {
                const app = new ast_1.Application(leftSide, expr);
                return this.parse(app);
                // }
            }
        }
    }
}
exports.Parser = Parser;
