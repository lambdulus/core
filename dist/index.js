"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lexer_1 = __importDefault(require("./lexer"));
var parser_1 = __importDefault(require("./parser"));
var visitor_1 = require("./visitors/visitor");
var basicprinter_1 = require("./visitors/basicprinter");
var lexer_2 = require("./lexer");
exports.Token = lexer_2.Token;
exports.tokenize = lexer_2.tokenize;
exports.Lexer = lexer_2.default;
var parser_2 = require("./parser");
exports.parse = parser_2.parse;
exports.Parser = parser_2.default;
var inputs = [
    '(Y (λ f n . (<= n 1) 1 (* n (f (- n 1))) ) 5)',
    '^ 4 4',
    '(~ x y z . x y z) 1 2 3',
    '(\\ x y z . x y z)',
    '(λ x . x x) A',
    '(λ x . x x)',
    '2 s z',
    '+ (* 4 5) D',
    'Y (λ f n . (< n 2) 1 (* n (f (- n 1))) ) 3',
    '(λ a b c d . - a b) 11 6 7 8',
    '+ (+ A B) C',
    '(λ ab . + ab)',
    'A (B +) C',
    '(+ A B)',
    '+ 555 6',
    '(λ _x . x x)',
];
console.log(inputs[0]);
var tokens = lexer_1.default.tokenize(inputs[0], {
    singleLetterVars: false,
    lambdaLetters: ['λ', '\\', '~'],
});
var ast = parser_1.default.parse(tokens);
var root = ast;
var e = 0;
while (true) {
    var normal = new visitor_1.NormalEvaluation(root);
    if (normal.nextReduction instanceof visitor_1.NextNone) {
        break;
    }
    root = normal.evaluate();
    e++;
    // const printer : BasicPrinter = new BasicPrinter(root)
    // const s = printer.print()
    // console.log(s)
}
console.log('steps: ' + e);
var printer = new basicprinter_1.BasicPrinter(root);
var s = printer.print();
console.log(s);
