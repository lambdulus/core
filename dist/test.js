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
    'QUICKSORT SHORTLIST',
    '(:: A (:: B (:: C NIL)))',
    'QUICKSORT MESSLIST',
    'Z (~ f n . (NOT n) 1 (f (- n 1))) 1',
    'Z (λ f n . (<= n 1) 1 (* n (f (- n 1))) ) 2',
    'Z (~ f n . (NOT n) (f (NOT n)) E) F',
    '(λ p q . q) (   (λ x y z. (x y) z)  (λ w v. w)   )',
    '(~ x y f . f x y) ((~ y . y m) (n e))',
    '(λ n . (Y (λ f n a . IF (= n 1) a (f (- n 1) (* n a)))) (- n 1) (n)) 3',
    'Z (~ f n . (= n 1) 1 (+ n (f (- n 1) )) ) 1',
    'NOT (ZERO 3)',
    '(~ m . (~ n . = n 1) m) 1',
    '< 1 2',
    '(λx. + x x)((λp. + p 4) 3)',
    '(~ n . + n 1)(+ 3 2)',
    '(λ x y. (< x y) x y) 2 3',
    '5 4',
    '^ 4 5',
    '+ 4 4',
    '(λ n . (Z (λ f n a . IF (= n 1) a (f (- n 1) (* n a)))) (- n 1) (n)) 3',
    '(~ n . (Y (~ f n a . (<= n 1) a (f (- n 1) (* n a)))) (- n 1) (n) ) 6',
    '+ (23) 4',
    '(Y (λ f n . (<= n 1) 1 (* n (f (- n 1))) ) 5)',
    '(Y (λ f n . (= n 0) 0 ((= n 1) 1 ( + (f (- n 1)) (f (- n 2))))) 4)',
    '(~ xyz . zyx ) 1 2 3',
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
    '0',
    '1',
    '2',
    '3',
    '4',
    // invalid exprs
    '11111111111111111111111111111111111111111111111111',
    '(λ a b . + a b) )) abc',
    '((',
    '( +',
    '( 23',
    '( a ( b )',
    '( a ( b ',
    '( a ( ',
    '(',
    '(  )',
    // ] bracket
    '+ (+ 23 (- 42 23] 4',
    '+ (+ 23 (- 42 23)) 4',
    '(  ]',
    '(]',
    '( a ( ]',
    '( a ( b ]',
    '( a ( b )]',
    '( + ]',
    '( 23 ]',
    '(( a ]',
];
console.log(inputs[0]);
const tokens = lexer_1.tokenize(inputs[0], {
    singleLetterVars: false,
    lambdaLetters: ['λ', '\\', '~'],
});
console.log(tokens.map((token) => token.value).join(' '));
console.log('--------------------');
const ast = parser_1.default.parse(tokens, {});
let root = ast;
let e = 0;
console.log(printTree(root));
// while (true) {
//   const normal : NormalAbstractionEvaluator = new NormalAbstractionEvaluator(root)
//   console.log(normal.nextReduction)
//   if (normal.nextReduction instanceof None) {
//     break
//   }
//   root = normal.perform() // perform next reduction
//   e++
//   console.log(printTree(root))
// }
while (true) {
    const normal = new normalevaluator_1.NormalEvaluator(root);
    if (normal.nextReduction instanceof none_1.None) {
        break;
    }
    root = normal.perform(); // perform next reduction
    e++;
    // console.log(printTree(root))
}
// while (true) {
//   const applicative : ApplicativeEvaluator = new ApplicativeEvaluator(root)
//   if (
//     // e > 35 ||
//     applicative.nextReduction instanceof None) {
//     break
//   }
//   root = applicative.perform() // perform next reduction
//   e++
//   // console.log('-------------------------------------------------')
//   // console.log(printTree(root))
//   console.log('-----------------------' + e + '--------------------------')
// }
function printTree(tree) {
    const printer = new basicprinter_1.BasicPrinter(tree);
    return printer.print();
}
exports.printTree = printTree;
console.log('steps: ' + e);
console.log(printTree(root));
