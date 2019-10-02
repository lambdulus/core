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
    }
});
function printTree(tree) {
    const printer = new basicprinter_1.BasicPrinter(tree);
    return printer.print();
}
exports.printTree = printTree;
