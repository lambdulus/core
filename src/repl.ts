import readline from 'readline'

import { None } from './reductions'
import { NormalEvaluator, NormalAbstractionEvaluator, Evaluator } from './evaluators'
import { AST } from './ast'
import * as Parser from './parser/'
import { Token, tokenize } from './lexer'
import { BasicPrinter } from './visitors/basicprinter'

const lineReader = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

lineReader.on('line', (line) => {
  const tokens : Array<Token> = tokenize(line, {
    singleLetterVars : false,
    lambdaLetters : [ 'λ', '\\', '~' ],
  })
  
  const ast : AST = Parser.parse(tokens, {
    'BAR' : 'CONS 1 NIL',
    'FOO' : 'CONS 0 BAR',
    'TEST' : 'CONS 1 TEST',
    'FACCT' : '(λ n . (Y (λ f n a . IF (= n 1) a (f (- n 1) (* n a)))) (- n 1) (n))',
    'SHORTLIST' : '(CONS 3 (CONS 5 (CONS 1 (CONS 10 (CONS 7 (CONS 2 (CONS 4 (CONS 9 (CONS 4 (CONS 6 (CONS 8 NIL)))))))))))',
    'MESSLIST' :  '(CONS 3 (CONS 5 (CONS 1 (CONS 10 (CONS 7 (CONS 2 (CONS 4 (CONS 9 (CONS 4 (CONS 6 (CONS 8 NIL)))))))))))',
    'LISTGREQ' : 'Y (λ fn piv list . IF (NULL list) (NIL) ( IF (>= (FIRST list) piv) (CONS (FIRST list) (fn piv (SECOND list))) (fn piv (SECOND list)) ) )',
    'LISTLESS' : 'Y (λ fn piv list . IF (NULL list) (NIL) ( IF (< (FIRST list) piv) (CONS (FIRST list) (fn piv (SECOND list))) (fn piv (SECOND list)) ) )',
    'LISTGR' : 'Y (λ fn piv list . IF (NULL list) (NIL) ( IF (> (FIRST list) piv) (CONS (FIRST list) (fn piv (SECOND list))) (fn piv (SECOND list)) ) )',
    'LISTEQ' : 'Y (λ fn piv list . IF (NULL list) (NIL) ( IF (= (FIRST list) piv) (CONS (FIRST list) (fn piv (SECOND list))) (fn piv (SECOND list)) ) )',
    'APPEND' : 'Y (λ fn listA listB . IF (NULL listA) (listB) (CONS (FIRST listA) (fn (SECOND listA) listB)))',
    'QUICKSORT' : 'Y (λ fn list . IF (NULL list) (NIL) ( IF (NULL (SECOND list)) (list) ( APPEND (fn (LISTLESS (FIRST list) list)) ( APPEND (LISTEQ (FIRST list) list) (fn (LISTGR (FIRST list) list)) ) ) ) )',
  })
  let root : AST = ast
  let e = 0
  
  console.log(printTree(root))
  
  while (true) {
    const evaluator : Evaluator = new NormalEvaluator(root)
    // const evaluator : Evaluator = new NormalAbstractionEvaluator(root)

  
    if (evaluator.nextReduction instanceof None) {
      break
    }
  
    root = evaluator.perform() // perform next reduction
  
    e++
  
    console.log(printTree(root))
  }
})

export function printTree (tree : AST) : string {
  const printer : BasicPrinter = new BasicPrinter(tree)
  return printer.print()
}