"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline_1 = __importDefault(require("readline"));
const reductions_1 = require("./reductions");
const evaluators_1 = require("./evaluators");
const Parser = __importStar(require("./parser/"));
const lexer_1 = require("./lexer");
const basicprinter_1 = require("./visitors/basicprinter");
const lineReader = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});
lineReader.on('line', (line) => {
    const tokens = lexer_1.tokenize(line, {
        singleLetterVars: true,
        lambdaLetters: ['λ', '\\', '~'],
    });
    const ast = Parser.parse(tokens, {
        'R': '(λ f n . = n 1 1 (+ n (f (- n 1))))',
        'FACT': '(Y (λ f n . (<= n 1) 1 (* n (f (- n 1)))))',
        'FIB': '(Y (λ f n . (= n 0) 0 ((= n 1) 1 ( + (f (- n 1)) (f (- n 2))))))',
        'INFLISTOF': '(λ n . (Y (λ x . (λ f s g . g f s) n x)))',
        'REMOVENTH': 'Y (λ fn list n . IF (= n 0) (SECOND list) (IF (NULL list) NIL (CONS (FIRST list) (fn (SECOND list) (- n 1) ) ) ) )',
        'NTH': 'Y (λ fn list n . IF (= n 0) (FIRST list) (IF (NULL (list)) NIL (fn (SECOND list) (- n 1)) ) )',
        'LEN': 'Y (λ fn list . IF (NULL list) (0) (+ 1 (fn (SECOND list) )) )',
        'MAP': ' (λ fn l . (Y (λ f it . IF (NULL it) (NIL) (CONS (fn (FIRST it)) (f (SECOND it))) )) l )',
        'REDUCE': '(λ fn l init . Y (λ f it acc . IF (NULL it) (acc) (f (SECOND it) (fn (FIRST it) acc)) ) l init )',
        'APPLY': '(λ f args . Y (λ ff f l . (NULL l) (f) (ff (f (FIRST l)) (SECOND l)) ) f args )',
        'RANGE': '(λ m n . Y (λ f e . (= e n) (CONS e NIL) (CONS e (f (+ e 1))) ) m )',
        'LISTCOMPR': '(λ args . APPLY (λ op in rng cond . Y (λ f l . (NULL l) (NIL) ( (cond (FIRST l)) (CONS (op (FIRST l)) (f (SECOND l))) (CONS (FIRST l) (f (SECOND l))) ) ) rng ) args )',
        'MOD': '( λ n m . (n (λ n . (= n (- m 1)) (0) (+ n 1)) (0)) )',
        'INFIX': 'APPLY (λ l op r . op l r)',
        'DELNTH': 'Y (λ fn list n . IF (= n 0) (SECOND list) (IF (NULL list) NIL (CONS (FIRST list) (fn (SECOND list) (- n 1) ) ) ) )',
        'VOID': '(λ s z . T)',
        'ISVOID': '(λp . p (λ e . F) F)',
        'TAKEnFROM': '(λ number list . Y (λ f list amount . NULL (SECOND list) (CONS (FIRST list) NIL) ( (= amount 0) NIL ( CONS (FIRST list) (f (SECOND list) (- amount 1)) ) ) ) list number)',
        'FACCT': '(λ n . (Y (λ f n a . IF (= n 1) a (f (- n 1) (* n a)))) (- n 1) (n))',
        'SHORTLIST': '(CONS 3 (CONS 5 (CONS 1 (CONS 10 (CONS 7 (CONS 2 (CONS 4 (CONS 9 (CONS 4 (CONS 6 (CONS 8 NIL)))))))))))',
        'MESSLIST': '(CONS 3 (CONS 5 (CONS 1 (CONS 10 (CONS 7 (CONS 2 (CONS 4 (CONS 9 (CONS 4 (CONS 6 (CONS 8 NIL)))))))))))',
        'LISTGREQ': 'Y (λ fn piv list . IF (NULL list) (NIL) ( IF (>= (FIRST list) piv) (CONS (FIRST list) (fn piv (SECOND list))) (fn piv (SECOND list)) ) )',
        'LISTLESS': 'Y (λ fn piv list . IF (NULL list) (NIL) ( IF (< (FIRST list) piv) (CONS (FIRST list) (fn piv (SECOND list))) (fn piv (SECOND list)) ) )',
        'LISTGR': 'Y (λ fn piv list . IF (NULL list) (NIL) ( IF (> (FIRST list) piv) (CONS (FIRST list) (fn piv (SECOND list))) (fn piv (SECOND list)) ) )',
        'LISTEQ': 'Y (λ fn piv list . IF (NULL list) (NIL) ( IF (= (FIRST list) piv) (CONS (FIRST list) (fn piv (SECOND list))) (fn piv (SECOND list)) ) )',
        'APPEND': 'Y (λ fn listA listB . IF (NULL listA) (listB) (CONS (FIRST listA) (fn (SECOND listA) listB)))',
        'QUICKSORT': 'Y (λ fn list . IF (NULL list) (NIL) ( IF (NULL (SECOND list)) (list) ( APPEND (fn (LISTLESS (FIRST list) list)) ( APPEND (LISTEQ (FIRST list) list) (fn (LISTGR (FIRST list) list)) ) ) ) )',
    });
    let root = ast;
    let e = 0;
    // console.log(tokens)
    // console.log(root)
    console.log(printTree(root));
    while (true) {
        // const evaluator : Evaluator = new NormalEvaluator(root)
        const evaluator = new evaluators_1.NormalAbstractionEvaluator(root);
        if (evaluator.nextReduction instanceof reductions_1.None) {
            break;
        }
        root = evaluator.perform(); // perform next reduction
        e++;
        console.log(printTree(root));
        if (e > 5)
            break;
    }
});
function printTree(tree) {
    const printer = new basicprinter_1.BasicPrinter(tree);
    return printer.print();
}
exports.printTree = printTree;
