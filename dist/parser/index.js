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
exports.builtinMacros = {
    'Y': '(λ f . (λ x . f (x x)) (λ x . f (x x)))',
    'Z': '(λ f . (λ y . f (λ z . y y z)) (λ y . f (λ z . y y z)))',
    'ZERO': '(λ n . n (λ x . (λ t f . f)) (λ t f . t))',
    'PRED': '(λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))',
    'SUC': '(λ n s z . s (n s z))',
    'AND': '(λ x y . x y x)',
    'OR': '(λ x y . x x y)',
    'T': '(λ t f . t)',
    'F': '(λ t f . f)',
    'NOT': '(λ p . p F T)',
    // 'NOT' : '(λ p a b . p b a)',
    // 'NOTapp' : '(λ p a b . p b a)',
    '+': '(λ x y s z . x s (y s z))',
    '-': '(λ m n . (n PRED) m)',
    '*': '(λ x y z . x (y z))',
    '/': '(λ n . Y (λ c n m f x . (λ d . ZERO d (0 f x) (f (c d m f x))) (- n m)) (SUC n))',
    '^': '(λ x y . y x)',
    'DELTA': '(λ m n . + (- m n) (- n m))',
    '=': '(λ m n . ZERO (DELTA m n))',
    '>': '(λ m n . NOT (ZERO (- m n)))',
    '<': '(λ m n . > n m )',
    '>=': '(λ m n . ZERO (- n m))',
    '<=': '(λ m n . ZERO (- m n))',
    'IF': '(λ p t e . p t e)',
    'PAIR': '(λ f s . (λ g . g f s))',
    'FIRST': '(λ p . p (λ f s . f))',
    'SECOND': '(λ p . p (λ f s . s))',
    'CONS': '(λ car cdr . (λ g . g car cdr))',
    'NIL': '(λx. T)',
    'NULL': '(λp.p (λx y.F))',
    ':': 'CONS',
    '[]': '(λx. T)'
};
function toAst(definition, macroTable) {
    const codeStyle = { singleLetterVars: false, lambdaLetters: ['λ'] };
    const parser = new parser_1.Parser(lexer_1.tokenize(definition, codeStyle), macroTable);
    return parser.parse(null);
}
// TODO: refactor macroTable for usage with user defined macro definitions
function parse(tokens, userMacros) {
    const macroTable = {};
    for (const [name, definition] of Object.entries(exports.builtinMacros)) {
        macroTable[name] = new MacroDef(toAst(definition, macroTable));
    }
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
        if (name in exports.builtinMacros) {
            // TODO: maybe dont throw? better throw, just to be sure :D
            // zvazit - dovoluju predefinovat cisla
            throw new Error('Cannot redefine built-in Macro ' + name);
        }
        macroTable[name] = new MacroDef(toAst(definition, macroTable));
    }
    const parser = new parser_1.Parser(tokens, macroTable);
    return parser.parse(null);
}
exports.parse = parse;
// TODO: delete?
exports.default = {
    parse,
    Lambda: ast_1.Lambda,
    Variable: ast_1.Variable,
    Macro: ast_1.Macro,
    Application: ast_1.Application,
};
