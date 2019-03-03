"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var lexer_1 = __importStar(require("../lexer"));
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
    Reduction[Reduction["Alpha"] = 0] = "Alpha";
    Reduction[Reduction["Beta"] = 1] = "Beta";
    Reduction[Reduction["Expansion"] = 2] = "Expansion";
    Reduction[Reduction["None"] = 3] = "None";
})(Reduction = exports.Reduction || (exports.Reduction = {}));
var Child;
(function (Child) {
    Child["Left"] = "left";
    Child["Right"] = "right";
})(Child = exports.Child || (exports.Child = {}));
var NextAlpha = /** @class */ (function () {
    function NextAlpha(tree, child, oldName, newName) {
        this.tree = tree;
        this.child = child;
        this.oldName = oldName;
        this.newName = newName;
    }
    return NextAlpha;
}());
exports.NextAlpha = NextAlpha;
var NextBeta = /** @class */ (function () {
    function NextBeta(parent, treeSide, // na jaky strane pro parenta je redukovanej uzel
    target, // EXPR ve kterem se provede nahrada
    argName, value) {
        this.parent = parent;
        this.treeSide = treeSide;
        this.target = target;
        this.argName = argName;
        this.value = value;
    }
    return NextBeta;
}());
exports.NextBeta = NextBeta;
// TODO: vyresit pro pripady kdy jde o multilambdu
// pak bude navic drzet mnozinu values a mnozinu arguments
// spis mnozinu tuples
var NextExpansion = /** @class */ (function () {
    function NextExpansion(parent, treeSide, tree) {
        this.parent = parent;
        this.treeSide = treeSide;
        this.tree = tree;
    }
    return NextExpansion;
}());
exports.NextExpansion = NextExpansion;
var NextNone = /** @class */ (function () {
    function NextNone() {
    }
    return NextNone;
}());
exports.NextNone = NextNone;
var Parser = /** @class */ (function () {
    function Parser(tokens, macroTable) {
        this.tokens = tokens;
        this.macroTable = macroTable;
        this.position = 0;
    }
    // TODO: refactor
    // maybe put it outside of Parser class inside the Parser module
    Parser.toAst = function (definition, macroTable) {
        var codeStyle = { singleLetterVars: true, lambdaLetters: ['λ'] };
        var parser = new Parser(lexer_1.default.tokenize(definition, codeStyle), macroTable);
        return parser.parse(null);
    };
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
            return leftSide; // TODO: lefSide should never ever happen to be null -> check again
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
    // TODO: refactor macroTable for usage with user defined macro definitions
    var macroTable = {};
    macroTable['Y'] = new MacroDef(Parser.toAst("(\u03BB f . (\u03BB x . f (x x)) (\u03BB x . f (x x)))", macroTable)),
        macroTable['ZERO'] = new MacroDef(Parser.toAst("(\u03BB n . n (\u03BB x . (\u03BB t f . f)) (\u03BB t f . t))", macroTable)),
        macroTable['PRED'] = new MacroDef(Parser.toAst("(\u03BB x s z . x (\u03BB f g . g (f s)) (\u03BB g . z) (\u03BB u . u))", macroTable));
    macroTable['SUC'] = new MacroDef(Parser.toAst("(\u03BB n s z . s (n s z))", macroTable));
    macroTable['AND'] = new MacroDef(Parser.toAst("(\u03BB x y . x y x)", macroTable));
    macroTable['OR'] = new MacroDef(Parser.toAst("(\u03BB x y . x x y)", macroTable));
    macroTable['NOT'] = new MacroDef(Parser.toAst("(\u03BB p . p F T)", macroTable));
    macroTable['T'] = new MacroDef(Parser.toAst("(\u03BB t f . t)", macroTable)),
        macroTable['F'] = new MacroDef(Parser.toAst("(\u03BB t f . f)", macroTable)),
        macroTable['+'] = new MacroDef(Parser.toAst("(\u03BB x y s z . x s (y s z))", macroTable)),
        macroTable['-'] = new MacroDef(Parser.toAst("(\u03BB m n . (n PRED) m)", macroTable));
    macroTable['*'] = new MacroDef(Parser.toAst("(\u03BB x y z . x (y z))", macroTable)),
        macroTable['/'] = new MacroDef(Parser.toAst("(\u03BB n . Y (\u03BB c n m f x . (\u03BB d . ZERO d (0 f x) (f (c d m f x))) (- n m)) (SUC n))", macroTable));
    macroTable['^'] = new MacroDef(Parser.toAst("(\u03BB x y . x y)", macroTable));
    macroTable['DELTA'] = new MacroDef(Parser.toAst("(\u03BB m n . + (- m n) (- n m))", macroTable));
    macroTable['='] = new MacroDef(Parser.toAst("(\u03BB m n . ZERO (DELTA m n))", macroTable));
    macroTable['>'] = new MacroDef(Parser.toAst("(\u03BB m n . NOT (ZERO (- m n)))", macroTable));
    macroTable['<'] = new MacroDef(Parser.toAst("(\u03BB m n . > n m )", macroTable));
    macroTable['>='] = new MacroDef(Parser.toAst("(\u03BB m n . ZERO (- n m))", macroTable));
    macroTable['<='] = new MacroDef(Parser.toAst("(\u03BB m n . ZERO (- m n))", macroTable));
    // QUICK MACROS - non recursively defined
    // macroTable['NOT'] = new MacroDef(Parser.toAst(`(λ p . p (λ t f . f) (λ t f . t))`, macroTable))
    // macroTable['-'] = new MacroDef(Parser.toAst(`(λ m n . (n (λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))) m)`, macroTable))
    // macroTable['/'] = new MacroDef(Parser.toAst(`(λ n . (λ f . (λ x . f (x x)) (λ x . f (x x))) (λ c n m f x . (λ d . (λ n . n (λ x . (λ t f . f)) (λ t f . t)) d (0 f x) (f (c d m f x))) ((λ m n . (n (λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))) m) n m)) ((λ n s z . s (n s z)) n))`, macroTable))
    // macroTable['DELTA'] = new MacroDef(Parser.toAst(`(λ m n . (λ x y s z . x s (y s z)) ((λ m n . (n (λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))) m) m n) ((λ m n . (n (λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))) m) n m))`, macroTable))
    // macroTable['='] = new MacroDef(Parser.toAst(`(λ m n . (λ n . n (λ x . (λ t f . f)) (λ t f . t)) ((λ m n . (λ x y s z . x s (y s z)) ((λ m n . (n (λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))) m) m n) ((λ m n . (n (λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))) m) n m)) m n))`, macroTable))
    // macroTable['>'] = new MacroDef(Parser.toAst(`(λ m n . (λ p . p (λ t f . f) (λ t f . t)) ((λ n . n (λ x . (λ t f . f)) (λ t f . t)) ((λ m n . (n (λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))) m) m n)))`, macroTable))
    // macroTable['<'] = new MacroDef(Parser.toAst(`(λ m n . (λ m n . (λ p . p (λ t f . f) (λ t f . t)) ((λ n . n (λ x . (λ t f . f)) (λ t f . t)) ((λ m n . (n (λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))) m) m n))) n m )`, macroTable))
    // macroTable['>='] = new MacroDef(Parser.toAst(`(λ m n . (λ n . n (λ x . (λ t f . f)) (λ t f . t)) (- n m))`, macroTable))  
    // macroTable['<='] = new MacroDef(Parser.toAst(`(λ m n . (λ n . n (λ x . (λ t f . f)) (λ t f . t)) ((λ m n . (n (λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))) m) m n))`, macroTable))
    var parser = new Parser(tokens, macroTable);
    return parser.parse(null);
}
exports.parse = parse;
exports.default = {
    parse: parse,
    Lambda: lambda_1.Lambda,
    Variable: variable_1.Variable,
    Macro: macro_1.Macro,
    Application: application_1.Application,
};
