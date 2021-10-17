"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = exports.builtinMacros = exports.MacroDef = void 0;
const parser_1 = require("./parser");
class MacroDef {
    constructor(ast) {
        this.ast = ast;
    }
}
exports.MacroDef = MacroDef;
exports.builtinMacros = {
    // TODO: uncomment these once PPA students reach them
    'Y': '(λ f . (λ x . f (x x)) (λ x . f (x x)))',
    // 'Z' : '(λ f . (λ y . f (λ z . y y z)) (λ y . f (λ z . y y z)))',
    'ZERO': '(λ n . n (λ x . (λ t f . f)) (λ t f . t))',
    // TODO: uncomment these once PPA students reach them
    'PRED': '(λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))',
    'SUC': '(λ n s z . s (n s z))',
    'AND': '(λ x y . x y x)',
    'OR': '(λ x y . x T y)',
    'OR2': '(λ x y . x x y)',
    'T': '(λ t f . t)',
    'F': '(λ t f . f)',
    'NOT': '(λ x t f . x f t)',
    'NOT2': '(λ p . p F T)',
    '+': '(λ x y s z . x s (y s z))',
    '-': '(λ m n . (n PRED) m)',
    '*': '(λ x y s . x (y s))',
    '/': '(λ n . Y (λ c n m f x . (λ d . ZERO d (0 f x) (f (c d m f x))) (- n m)) (SUC n))',
    '^': '(λ x y . y x)',
    'DELTA': '(λ m n . + (- m n) (- n m))',
    '=': '(λ m n . ZERO (DELTA m n))',
    '>': '(λ m n . NOT (ZERO (- m n)))',
    '<': '(λ m n . > n m )',
    '>=': '(λ m n . ZERO (- n m))',
    '<=': '(λ m n . ZERO (- m n))',
    // TODO: uncomment these once PPA students reach them
    // 'IF' : '(λ p t e . p t e)',
    // 'PAIR' : '(λ f s . (λ g . g f s))',
    // 'FIRST' : '(λ p . p (λ f s . f))',
    // 'SECOND' : '(λ p . p (λ f s . s))',
    // 'CONS' : '(λ car cdr . (λ g . g car cdr))',
    // 'NIL' : '(λx. T)',
    // 'NULL' : '(λp.p (λx y.F))',
};
// TODO: remove
// function toAst (definition : string, macroTable : MacroTable) : AST {
//   const codeStyle : CodeStyle = { singleLetterVars : false, lambdaLetters : [ 'λ' ], macromap : {} }
//   const parser : Parser = new Parser(tokenize(definition, codeStyle), macroTable)
//   return parser.parse(null)
// }
function parse(tokens, userMacros) {
    const macroTable = {};
    // TODO: @dynamic-macros
    // TODO: tohle by eventuelne nebylo potreba delat - zbytecny kopirovani
    // na druhou stranu - macroTable slouci built-iny a user-definy takze asi proc ne?
    for (const [name, definition] of Object.entries(exports.builtinMacros)) {
        // TODO: @dynamic-macros
        // macroTable[name] = new MacroDef(toAst(definition, macroTable))
        macroTable[name] = definition;
    }
    for (const [name, definition] of Object.entries(userMacros)) {
        if (name in exports.builtinMacros) {
            throw new Error('Cannot redefine built-in Macro [ ' + name + ' ]');
        }
        // TODO: @dynamic-macros
        // macroTable[name] = new MacroDef(toAst(definition, macroTable))
        macroTable[name] = definition;
    }
    const parser = new parser_1.Parser(tokens, macroTable);
    return parser.parse(null);
}
exports.parse = parse;
exports.default = {
    parse
};
