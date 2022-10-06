"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.printTree = void 0;
const lexer_1 = require("./lexer");
const parser_1 = __importDefault(require("./parser"));
const basicprinter_1 = require("./visitors/basicprinter");
const normalevaluator_1 = require("./evaluators/normalevaluator");
const none_1 = require("./reductions/none");
const valids = [
    `Y FACT 6`,
    `ZERO1ZERO0ZERO2 0`,
    `(~ ZERO . ZERO 0)`,
    `(~ x1x2x. + x1 x2 x3)`,
    `+ 1`,
    `+ 2 (λ s z . s z)`,
    `= ( - 3 1 ) 1`,
    `+ (+ 2 1) 1`,
    `+ (+ 2 1) (+ 2 2)`,
    `+ (+ 2 1) ((λ x . + x x) 2)`,
    `FACCT 6`,
    `+ 2 1`,
    `<= 2 4`,
    `FACCT 3`,
    `QUICKSORT '(3 1 2)`,
    `(λ z y x . + (+ 2 x) y) Z 2 3`,
    `A B '(+ 1 2)`,
    `(λ y . (λ x . (+ 2) x) y)`,
    `(λ x . (+ 2) x)`,
    `'()`,
    `'(+ 1 2)`,
    `'(A)`,
    `'(A B)`,
    `'(A B C D E)`,
    '(~ n . (Y (~ f n a . (<= n 1) a (f (- n 1) (* n a)))) (- n 1) (n) ) 7',
    'QUICKSORT SHORTLIST',
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
    // '(~ xyz . zyx ) 1 2 3', // TEST with singlelettervars set to true
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
    // ] bracket
    '+ (+ 23 (- 42 23] 4',
    '+ (+ 23 (- 42 23)) 4',
    '( a ( b ]',
    '( a ( b )]',
    '( + ]',
    '( 23 ]',
    '(( a ]',
    // invalids
    // '(λ _x . x x)', // invalid cause of _x
    // 'A B C () E', // netusim jestli tohle chci mit jako validni NECHCI
    // 'A (B C) D ()', // ani tohle netusim NECHCI
];
const invalids = [
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
    '(  ]',
    '(]',
    '( a ( ]', // SHOULD FAIL
];
function testValids() {
    for (const expr of valids) {
        const macromap = {
            'FACCT': '(λ n . (Y (λ f n a . IF (= n 1) a (f (- n 1) (* n a)))) (- n 1) (n))',
            'SHORTLIST': '(CONS 3 (CONS 5 (CONS 1 (CONS 10 (CONS 7 (CONS 2 (CONS 4 (CONS 9 (CONS 4 (CONS 6 (CONS 8 NIL)))))))))))',
            'MESSLIST': '(CONS 3 (CONS 5 (CONS 1 (CONS 10 (CONS 7 (CONS 2 (CONS 4 (CONS 9 (CONS 4 (CONS 6 (CONS 8 NIL)))))))))))',
            'LISTGREQ': 'Y (λ fn piv list . IF (NULL list) (NIL) ( IF (>= (FIRST list) piv) (CONS (FIRST list) (fn piv (SECOND list))) (fn piv (SECOND list)) ) )',
            'LISTLESS': 'Y (λ fn piv list . IF (NULL list) (NIL) ( IF (< (FIRST list) piv) (CONS (FIRST list) (fn piv (SECOND list))) (fn piv (SECOND list)) ) )',
            'LISTGR': 'Y (λ fn piv list . IF (NULL list) (NIL) ( IF (> (FIRST list) piv) (CONS (FIRST list) (fn piv (SECOND list))) (fn piv (SECOND list)) ) )',
            'LISTEQ': 'Y (λ fn piv list . IF (NULL list) (NIL) ( IF (= (FIRST list) piv) (CONS (FIRST list) (fn piv (SECOND list))) (fn piv (SECOND list)) ) )',
            'APPEND': 'Y (λ fn listA listB . IF (NULL listA) (listB) (CONS (FIRST listA) (fn (SECOND listA) listB)))',
            'QUICKSORT': 'Y (λ fn list . IF (NULL list) (NIL) ( IF (NULL (SECOND list)) (list) ( APPEND (fn (LISTLESS (FIRST list) list)) ( APPEND (LISTEQ (FIRST list) list) (fn (LISTGR (FIRST list) list)) ) ) ) )',
        };
        try {
            const tokens = (0, lexer_1.tokenize)(expr, {
                singleLetterVars: false,
                lambdaLetters: ['λ', '\\', '~'],
                macromap,
            });
            const ast = parser_1.default.parse(tokens, macromap);
            let root = ast;
            let e = 0;
        }
        catch (exception) {
            console.log('INVALID:');
            console.log(expr);
            console.log('--------------------------------');
        }
    }
}
function testInvalids() {
    for (const expr of invalids) {
        const macromap = {
            'FACCT': '(λ n . (Y (λ f n a . IF (= n 1) a (f (- n 1) (* n a)))) (- n 1) (n))',
            'SHORTLIST': '(CONS 3 (CONS 5 (CONS 1 (CONS 10 (CONS 7 (CONS 2 (CONS 4 (CONS 9 (CONS 4 (CONS 6 (CONS 8 NIL)))))))))))',
            'MESSLIST': '(CONS 3 (CONS 5 (CONS 1 (CONS 10 (CONS 7 (CONS 2 (CONS 4 (CONS 9 (CONS 4 (CONS 6 (CONS 8 NIL)))))))))))',
            'LISTGREQ': 'Y (λ fn piv list . IF (NULL list) (NIL) ( IF (>= (FIRST list) piv) (CONS (FIRST list) (fn piv (SECOND list))) (fn piv (SECOND list)) ) )',
            'LISTLESS': 'Y (λ fn piv list . IF (NULL list) (NIL) ( IF (< (FIRST list) piv) (CONS (FIRST list) (fn piv (SECOND list))) (fn piv (SECOND list)) ) )',
            'LISTGR': 'Y (λ fn piv list . IF (NULL list) (NIL) ( IF (> (FIRST list) piv) (CONS (FIRST list) (fn piv (SECOND list))) (fn piv (SECOND list)) ) )',
            'LISTEQ': 'Y (λ fn piv list . IF (NULL list) (NIL) ( IF (= (FIRST list) piv) (CONS (FIRST list) (fn piv (SECOND list))) (fn piv (SECOND list)) ) )',
            'APPEND': 'Y (λ fn listA listB . IF (NULL listA) (listB) (CONS (FIRST listA) (fn (SECOND listA) listB)))',
            'QUICKSORT': 'Y (λ fn list . IF (NULL list) (NIL) ( IF (NULL (SECOND list)) (list) ( APPEND (fn (LISTLESS (FIRST list) list)) ( APPEND (LISTEQ (FIRST list) list) (fn (LISTGR (FIRST list) list)) ) ) ) )',
        };
        try {
            const tokens = (0, lexer_1.tokenize)(expr, {
                singleLetterVars: false,
                lambdaLetters: ['λ', '\\', '~'],
                macromap
            });
            const ast = parser_1.default.parse(tokens, macromap);
            let root = ast;
            let e = 0;
            console.log('SHOULD BE INVALID:');
            console.log(expr);
            console.log('--------------------------------');
        }
        catch (exception) {
            console.log('IS CORRECTLY INVALID');
            console.log(expr);
            console.log(exception);
            console.log('--------------------------------');
        }
    }
}
// testValids()
// console.log('..........................................')
// console.log('..........................................')
// console.log('..........................................')
// console.log('..........................................')
// testInvalids()
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
// while (true) {
//   const optimize : OptimizeEvaluator = new OptimizeEvaluator(root)
//   if (optimize.nextReduction instanceof None) {
//     break
//   }
//   root = optimize.perform() // perform next reduction
//   e++
//   console.log(printTree(root))
// }
// console.log('====================')
// console.log('====================')
// console.log('====================')
const macromap = {
    'FACCT': '(λ n . (Y (λ f n a . IF (= n 1) a (f (- n 1) (* n a)))) (- n 1) (n))',
    'SHORTLIST': '(CONS 3 (CONS 5 (CONS 1 (CONS 10 (CONS 7 (CONS 2 (CONS 4 (CONS 9 (CONS 4 (CONS 6 (CONS 8 NIL)))))))))))',
    'MESSLIST': '(CONS 3 (CONS 5 (CONS 1 (CONS 10 (CONS 7 (CONS 2 (CONS 4 (CONS 9 (CONS 4 (CONS 6 (CONS 8 NIL)))))))))))',
    'LISTGREQ': 'Y (λ fn piv list . IF (NULL list) (NIL) ( IF (>= (FIRST list) piv) (CONS (FIRST list) (fn piv (SECOND list))) (fn piv (SECOND list)) ) )',
    'LISTLESS': 'Y (λ fn piv list . IF (NULL list) (NIL) ( IF (< (FIRST list) piv) (CONS (FIRST list) (fn piv (SECOND list))) (fn piv (SECOND list)) ) )',
    'LISTGR': 'Y (λ fn piv list . IF (NULL list) (NIL) ( IF (> (FIRST list) piv) (CONS (FIRST list) (fn piv (SECOND list))) (fn piv (SECOND list)) ) )',
    'LISTEQ': 'Y (λ fn piv list . IF (NULL list) (NIL) ( IF (= (FIRST list) piv) (CONS (FIRST list) (fn piv (SECOND list))) (fn piv (SECOND list)) ) )',
    'APPEND': 'Y (λ fn listA listB . IF (NULL listA) (listB) (CONS (FIRST listA) (fn (SECOND listA) listB)))',
    'QUICKSORT': 'Y (λ fn list . IF (NULL list) (NIL) ( IF (NULL (SECOND list)) (list) ( APPEND (fn (LISTLESS (FIRST list) list)) ( APPEND (LISTEQ (FIRST list) list) (fn (LISTGR (FIRST list) list)) ) ) ) )',
};
const tokens = (0, lexer_1.tokenize)(valids[0], {
    singleLetterVars: false,
    lambdaLetters: ['λ', '\\', '~'],
    macromap,
});
const ast = parser_1.default.parse(tokens, macromap);
let root = ast;
let e = 0;
console.log(printTree(root));
// while (true) {
//   const normal : NormalAbstractionEvaluator = new NormalAbstractionEvaluator(root)
//   if (normal.nextReduction instanceof None) {
//     break
//   }
//   // console.log(normal.nextReduction)
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
