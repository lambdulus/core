"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lexer_1 = __importDefault(require("./lexer"));
var parser_1 = __importDefault(require("./parser/parser"));
var lexer_2 = require("./lexer");
exports.Token = lexer_2.Token;
exports.tokenize = lexer_2.tokenize;
var inputs = [
    '(Y (λ f n . (<= n 1) 1 (* n (f (- n 1))) ) 5)',
    '2 s z',
    '+ (* 4 5) D',
    'Y (λ f n . (< n 2) 1 (* n (f (- n 1))) ) 3',
    '(λ a b c d . - a b) 11 6 7 8',
    '+ (+ A B) C',
    '(λ ab . + ab)',
    'A (B +) C',
    '(+ A B)',
    '+ 555 6',
];
var tokens = lexer_1.default.tokenize(inputs[0], {
    singleLetterVars: false,
    lambdaLetters: ['λ'],
});
// tokens.forEach(token => console.log(token))
// console.log('--------------------------')
var ast = parser_1.default.parse(tokens);
// console.log()
// console.log(inspect(ast, false, null, true))
// console.log()
console.log(inputs[0]);
// console.log(ast.print())
var i = ast;
var e = 0;
while (true) {
    var _a = i.reduceNormal(), tree = _a.tree, reduced = _a.reduced, reduction = _a.reduction, currentSubtree = _a.currentSubtree;
    // console.log()
    // console.log({ reduced, reduction })
    // console.log(tree.print())
    // console.log()
    i = tree;
    e++;
    if (reduced === false)
        break;
}
console.log('steps: ' + e);
console.log(i.print());
