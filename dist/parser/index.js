"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lexer_1 = require("../lexer");
const parser_1 = require("./parser");
const ast_1 = require("../ast");
class MacroDef {
    constructor(ast) {
        this.ast = ast;
    }
}
exports.MacroDef = MacroDef;
function toAst(definition, macroTable) {
    const codeStyle = { singleLetterVars: false, lambdaLetters: ['λ'] };
    const parser = new parser_1.Parser(lexer_1.tokenize(definition, codeStyle), macroTable);
    return parser.parse(null);
}
// TODO: refactor macroTable for usage with user defined macro definitions
function parse(tokens, userMacros) {
    const macroTable = {};
    macroTable['Y'] = new MacroDef(toAst(`(λ f . (λ x . f (x x)) (λ x . f (x x)))`, macroTable)),
        macroTable['ZERO'] = new MacroDef(toAst(`(λ n . n (λ x . (λ t f . f)) (λ t f . t))`, macroTable)),
        macroTable['PRED'] = new MacroDef(toAst(`(λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))`, macroTable));
    macroTable['SUC'] = new MacroDef(toAst(`(λ n s z . s (n s z))`, macroTable));
    macroTable['AND'] = new MacroDef(toAst(`(λ x y . x y x)`, macroTable));
    macroTable['OR'] = new MacroDef(toAst(`(λ x y . x x y)`, macroTable));
    macroTable['NOT'] = new MacroDef(toAst(`(λ p . p F T)`, macroTable));
    macroTable['T'] = new MacroDef(toAst(`(λ t f . t)`, macroTable)),
        macroTable['F'] = new MacroDef(toAst(`(λ t f . f)`, macroTable)),
        macroTable['+'] = new MacroDef(toAst(`(λ x y s z . x s (y s z))`, macroTable)),
        macroTable['-'] = new MacroDef(toAst(`(λ m n . (n PRED) m)`, macroTable));
    macroTable['*'] = new MacroDef(toAst(`(λ x y z . x (y z))`, macroTable)),
        macroTable['/'] = new MacroDef(toAst(`(λ n . Y (λ c n m f x . (λ d . ZERO d (0 f x) (f (c d m f x))) (- n m)) (SUC n))`, macroTable));
    macroTable['^'] = new MacroDef(toAst(`(λ x y . x y)`, macroTable));
    macroTable['DELTA'] = new MacroDef(toAst(`(λ m n . + (- m n) (- n m))`, macroTable));
    macroTable['='] = new MacroDef(toAst(`(λ m n . ZERO (DELTA m n))`, macroTable));
    macroTable['>'] = new MacroDef(toAst(`(λ m n . NOT (ZERO (- m n)))`, macroTable));
    macroTable['<'] = new MacroDef(toAst(`(λ m n . > n m )`, macroTable));
    macroTable['>='] = new MacroDef(toAst(`(λ m n . ZERO (- n m))`, macroTable));
    macroTable['<='] = new MacroDef(toAst(`(λ m n . ZERO (- m n))`, macroTable));
    macroTable['IF'] = new MacroDef(toAst(`(λ p t e . p t e)`, macroTable));
    macroTable['PAIR'] = new MacroDef(toAst(`(λ f s . (λ g . g f s))`, macroTable));
    macroTable['FIRST'] = new MacroDef(toAst(`(λ p . p (λ f s . f))`, macroTable));
    macroTable['PAIR'] = new MacroDef(toAst(`(λ p . p (λ f s . s))`, macroTable));
    // TODO: chtel bych LIST, CONS, APPEND, GET NTH ITEM, MAP, ...
    // QUICK MACROS - non recursively defined
    // macroTable['NOT'] = new MacroDef(toAst(`(λ p . p (λ t f . f) (λ t f . t))`, macroTable))
    // macroTable['-'] = new MacroDef(toAst(`(λ m n . (n (λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))) m)`, macroTable))
    // macroTable['/'] = new MacroDef(toAst(`(λ n . (λ f . (λ x . f (x x)) (λ x . f (x x))) (λ c n m f x . (λ d . (λ n . n (λ x . (λ t f . f)) (λ t f . t)) d (0 f x) (f (c d m f x))) ((λ m n . (n (λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))) m) n m)) ((λ n s z . s (n s z)) n))`, macroTable))
    // macroTable['DELTA'] = new MacroDef(toAst(`(λ m n . (λ x y s z . x s (y s z)) ((λ m n . (n (λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))) m) m n) ((λ m n . (n (λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))) m) n m))`, macroTable))
    // macroTable['='] = new MacroDef(toAst(`(λ m n . (λ n . n (λ x . (λ t f . f)) (λ t f . t)) ((λ m n . (λ x y s z . x s (y s z)) ((λ m n . (n (λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))) m) m n) ((λ m n . (n (λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))) m) n m)) m n))`, macroTable))
    // macroTable['>'] = new MacroDef(toAst(`(λ m n . (λ p . p (λ t f . f) (λ t f . t)) ((λ n . n (λ x . (λ t f . f)) (λ t f . t)) ((λ m n . (n (λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))) m) m n)))`, macroTable))
    // macroTable['<'] = new MacroDef(toAst(`(λ m n . (λ m n . (λ p . p (λ t f . f) (λ t f . t)) ((λ n . n (λ x . (λ t f . f)) (λ t f . t)) ((λ m n . (n (λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))) m) m n))) n m )`, macroTable))
    // macroTable['>='] = new MacroDef(toAst(`(λ m n . (λ n . n (λ x . (λ t f . f)) (λ t f . t)) (- n m))`, macroTable))  
    // macroTable['<='] = new MacroDef(toAst(`(λ m n . (λ n . n (λ x . (λ t f . f)) (λ t f . t)) ((λ m n . (n (λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))) m) m n))`, macroTable))
    for (const [name, definition] of Object.entries(userMacros)) {
        macroTable[name] = new MacroDef(toAst(definition, macroTable));
    }
    const parser = new parser_1.Parser(tokens, macroTable);
    return parser.parse(null);
}
exports.parse = parse;
exports.builtinMacros = [
    ['Y', '(λ f . (λ x . f (x x)) (λ x . f (x x)))'],
    ['ZERO', '(λ n . n (λ x . (λ t f . f)) (λ t f . t))'],
    ['PRED', '(λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))'],
    ['SUC', '(λ n s z . s (n s z))'],
    ['AND', '(λ x y . x y x)'],
    ['OR', '(λ x y . x x y)'],
    ['NOT', '(λ p . p F T)'],
    ['T', '(λ t f . t)'],
    ['F', '(λ t f . f)'],
    ['+', '(λ x y s z . x s (y s z))'],
    ['-', '(λ m n . (n PRED) m)'],
    ['*', '(λ x y z . x (y z))'],
    ['/', '(λ n . Y (λ c n m f x . (λ d . ZERO d (0 f x) (f (c d m f x))) (- n m)) (SUC n))'],
    ['^', '(λ x y . x y)'],
    ['DELTA', '(λ m n . + (- m n) (- n m))'],
    ['=', '(λ m n . ZERO (DELTA m n))'],
    ['>', '(λ m n . NOT (ZERO (- m n)))'],
    ['<', '(λ m n . > n m )'],
    ['>=', '(λ m n . ZERO (- n m))'],
    ['<=', '(λ m n . ZERO (- m n))'],
    ['IF', '(λ p t e . p t e)'],
    ['PAIR', '(λ f s . (λ g . g f s))'],
    ['FIRST', '(λ p . p (λ f s . f))'],
    ['PAIR', '(λ p . p (λ f s . s))'],
];
// TODO: delete?
exports.default = {
    parse,
    Lambda: ast_1.Lambda,
    Variable: ast_1.Variable,
    Macro: ast_1.Macro,
    Application: ast_1.Application,
};
