"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lexer_1 = require("./lexer");
const parser_1 = __importDefault(require("./parser"));
const basicprinter_1 = require("./visitors/basicprinter");
const normalevaluator_1 = require("./visitors/normalevaluator");
const none_1 = require("./reductions/none");
const inputs = [
    '+ (23) 4',
    '(~ n . (Y (~ f n a . (<= n 1) a (f (- n 1) (* n a)))) (- n 1) (n) ) 6',
    '(Y (λ f n . (<= n 1) 1 (* n (f (- n 1))) ) 5)',
    '(Y (λ f n . (= n 0) 0 ((= n 1) 1 ( + (f (- n 1)) (f (- n 2))))) 4)',
    'x (λ s z . s (s z)) ((λ b . k (k b)) l)',
    'x (λ s z . s (s z)) ((λ a b . a (a b)) k l)',
    '(x 2) (2 s z)',
    '(~ x y . (~ z . x) z ) (x y)',
    '(~ z . z (~ x . (~ x . z))) (x z) 1 2',
    '(~ z . z (~ x . z)) (x y z)',
    '((~ x y z . (~ y . y y) x x y y z) (x y z) A z)',
    '(~ x y z . x y z) y z x',
    '1 a',
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
    '(  )',
    '(',
    '( a ( b )',
    '( a ( b ',
    '( a ( ',
    '((',
    '( +',
    '( 23',
];
console.log(inputs[0]);
const tokens = lexer_1.tokenize(inputs[0], {
    singleLetterVars: false,
    lambdaLetters: ['λ', '\\', '~'],
});
const ast = parser_1.default.parse(tokens);
let root = ast;
let e = 0;
while (true) {
    const normal = new normalevaluator_1.NormalEvaluator(root);
    if (normal.nextReduction instanceof none_1.None) {
        break;
    }
    root = normal.perform(); // perform next reduction
    e++;
    // console.log(printTree(root))
}
function printTree(tree) {
    const printer = new basicprinter_1.BasicPrinter(tree);
    return printer.print();
}
exports.printTree = printTree;
console.log('steps: ' + e);
console.log(printTree(root));
