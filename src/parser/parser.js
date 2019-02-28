"use strict";
exports.__esModule = true;
var lexer_1 = require("../lexer");
var lambda_1 = require("./ast/lambda");
var variable_1 = require("./ast/variable");
var macro_1 = require("./ast/macro");
var churchnumber_1 = require("./ast/churchnumber");
var application_1 = require("./ast/application");
var MacroDef = /** @class */ (function () {
    function MacroDef(ast) {
        this.ast = ast;
    }
    return MacroDef;
}());
exports.MacroDef = MacroDef;
var Reduction;
(function (Reduction) {
    Reduction[Reduction["alpha"] = 0] = "alpha";
    Reduction[Reduction["beta"] = 1] = "beta";
    Reduction[Reduction["expansion"] = 2] = "expansion";
    Reduction[Reduction["none"] = 3] = "none";
    // partialBeta, // = 4 // jelikoz veskery macro operace prelozim expanzi na pure λ nebudu delat partial
})(Reduction = exports.Reduction || (exports.Reduction = {}));
var Parser = /** @class */ (function () {
    function Parser(tokens, macroTable) {
        this.tokens = tokens;
        this.macroTable = macroTable;
        this.position = 0;
    }
    // TODO: refactor, because this looks terrible
    Parser.toAst = function (definition) {
        var codeStyle = { singleLetterVars: true, lambdaLetters: ['λ'] };
        var parser = new Parser(lexer_1["default"].tokenize(definition, codeStyle), {});
        return parser.parse(null);
    };
    // pokud budu chtit pridavat uzivatelska makra asi bude lepsi to udelat v constructoru
    // private static macroTable : MacroTable = {
    //   'Y' : new MacroDef(Parser.toAst(`(λ f . (λ x . f (x x)) (λ x . f (x x)))`)),
    //   // 'T' : new MacroDef(Parser.toAst(`(λ t f . t)`)),
    //   // 'F' : new MacroDef(Parser.toAst(`(λ t f . f)`)),
    //   // + - / * Zero Pred ...
    // }
    Parser.prototype.isMacro = function (token) {
        return token.value in this.macroTable;
    };
    Parser.prototype.top = function () {
        return this.tokens[this.position];
    };
    Parser.prototype.canAccept = function (type) {
        return (this.position < this.tokens.length
            ||
                this.top().type == type);
    };
    Parser.prototype.accept = function (type) {
        if (!this.canAccept(type)) {
            throw "Some Invalid token error";
        }
        this.position++;
    };
    Parser.prototype.exprEnd = function () {
        return (this.position === this.tokens.length
            ||
                this.top().type === lexer_1.TokenType.RightParen);
    };
    Parser.prototype.parseLambda = function () {
        var top = this.top();
        switch (top.type) {
            case lexer_1.TokenType.Dot:
                this.accept(lexer_1.TokenType.Dot);
                return this.parse(null); // λ body
            case lexer_1.TokenType.Identifier:
                this.accept(lexer_1.TokenType.Identifier);
                var argument = new variable_1.Variable(top);
                var body = this.parseLambda();
                return new lambda_1.Lambda(argument, body);
            default:
                throw "Some invalid token error";
        }
    };
    /**
     * SINGLE
         := number
         := operator
         := ident
         := '(' λ ident { ident } '.' LEXPR ')'
         := '(' LEXPR ')'
     */
    Parser.prototype.parseExpression = function () {
        var top = this.top();
        switch (top.type) {
            case lexer_1.TokenType.Number:
                this.accept(lexer_1.TokenType.Number);
                return new churchnumber_1.ChurchNumber(top);
            case lexer_1.TokenType.Operator:
                this.accept(lexer_1.TokenType.Operator);
                return new macro_1.Macro(top, this.macroTable[top.value]);
            case lexer_1.TokenType.Identifier:
                this.accept(lexer_1.TokenType.Identifier);
                // todo: I don't like this much, possible more elegant way?
                // if (top.value in Parser.macroTable) {
                if (this.isMacro(top)) {
                    return new macro_1.Macro(top, this.macroTable[top.value]);
                }
                return new variable_1.Variable(top);
            case lexer_1.TokenType.LeftParen:
                this.accept(lexer_1.TokenType.LeftParen);
                top = this.top();
                if (top.type === lexer_1.TokenType.Lambda) {
                    this.accept(lexer_1.TokenType.Lambda);
                    top = this.top();
                    this.accept(lexer_1.TokenType.Identifier);
                    var argument = new variable_1.Variable(top);
                    var body = this.parseLambda();
                    var lambda = new lambda_1.Lambda(argument, body);
                    this.accept(lexer_1.TokenType.RightParen);
                    return lambda;
                }
                else {
                    // ( LEXPR )
                    var expr = this.parse(null);
                    this.accept(lexer_1.TokenType.RightParen);
                    return expr;
                }
            default:
                throw "Some syntax error";
        }
    };
    /**
     * LEXPR := SINGLE { SINGLE }
     */
    Parser.prototype.parse = function (leftSide) {
        if (this.exprEnd()) {
            return leftSide;
        }
        else {
            var expr = this.parseExpression();
            if (leftSide === null) {
                return this.parse(expr);
            }
            else {
                var app = new application_1.Application(leftSide, expr);
                return this.parse(app);
            }
        }
    };
    return Parser;
}());
function parse(tokens) {
    // TODO: refactor some global stuff
    var macroTable = {
        'Y': new MacroDef(Parser.toAst("(\u03BB f . (\u03BB x . f (x x)) (\u03BB x . f (x x)))")),
        'T': new MacroDef(Parser.toAst("(\u03BB t f . t)")),
        'F': new MacroDef(Parser.toAst("(\u03BB t f . f)")),
        '+': new MacroDef(Parser.toAst("(\u03BB x y s z . x s (y s z))")),
        '-': new MacroDef(Parser.toAst("(\u03BB m n . (n (\u03BB x s z . x (\u03BB f g . g (f s)) (\u03BB g . z) (\u03BB u . u))) m)")),
        '*': new MacroDef(Parser.toAst("(\u03BB x y z . x (y z))")),
        '/': new MacroDef(Parser.toAst("(\u03BB n . (\u03BB f . (\u03BB x . f (x x)) (\u03BB x . f (x x))) (\u03BB c n m f x . (\u03BB d . (\u03BB n . n (\u03BB x . (\u03BB t f . f)) (\u03BB t f . t)) d (0 f x) (f (c d m f x))) ((\u03BB m n . (n (\u03BB x s z . x (\u03BB f g . g (f s)) (\u03BB g . z) (\u03BB u . u))) m) n m)) ((\u03BB n s z . s (n s z)) n))")),
        'ZERO': new MacroDef(Parser.toAst("(\u03BB n . n (\u03BB x . (\u03BB t f . f)) (\u03BB t f . t))")),
        'NOT': new MacroDef(Parser.toAst("(\u03BB p . p (\u03BB t f . f) (\u03BB t f . t))")),
        '>': new MacroDef(Parser.toAst("(\u03BB m n . (\u03BB p . p (\u03BB t f . f) (\u03BB t f . t)) ((\u03BB n . n (\u03BB x . (\u03BB t f . f)) (\u03BB t f . t)) ((\u03BB m n . (n (\u03BB x s z . x (\u03BB f g . g (f s)) (\u03BB g . z) (\u03BB u . u))) m) m n)))")),
        '<': new MacroDef(Parser.toAst("(\u03BB m n . (\u03BB m n . (\u03BB p . p (\u03BB t f . f) (\u03BB t f . t)) ((\u03BB n . n (\u03BB x . (\u03BB t f . f)) (\u03BB t f . t)) ((\u03BB m n . (n (\u03BB x s z . x (\u03BB f g . g (f s)) (\u03BB g . z) (\u03BB u . u))) m) m n))) n m )")),
        '<=': new MacroDef(Parser.toAst("(\u03BB m n . (\u03BB n . n (\u03BB x . (\u03BB t f . f)) (\u03BB t f . t)) ((\u03BB m n . (n (\u03BB x s z . x (\u03BB f g . g (f s)) (\u03BB g . z) (\u03BB u . u))) m) m n))"))
    };
    var parser = new Parser(tokens, macroTable);
    return parser.parse(null);
}
exports.parse = parse;
exports["default"] = {
    parse: parse,
    Lambda: lambda_1.Lambda,
    Variable: variable_1.Variable,
    Macro: macro_1.Macro,
    Application: application_1.Application
};
