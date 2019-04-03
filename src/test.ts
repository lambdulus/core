import { Token, tokenize } from './lexer'
import Parser from './parser'

import { BasicPrinter } from './visitors/basicprinter'
import { NormalEvaluator } from './visitors/normalevaluator'
import { NormalAbstractionEvaluator } from './visitors/normalabstractionevaluator';
import { AST } from './ast'
import { None } from './reductions/none';

const inputs : Array<string> = [
  '(λ x y. (< x y) x y) 2 3',
  '5 4',
  '^ 4 5',
  '+ 4 4',
  '(λ n .(Y (λ f n a . IF (= n 1) a (f (- n 1) (* n a)))) (- n 1) (n)) 3',
  '(~ n . (Y (~ f n a . (<= n 1) a (f (- n 1) (* n a)))) (- n 1) (n) ) 6', // factorial with accumulator
  '+ (23) 4',
  '(Y (λ f n . (<= n 1) 1 (* n (f (- n 1))) ) 5)', // factorial without accumulator
  '(Y (λ f n . (= n 0) 0 ((= n 1) 1 ( + (f (- n 1)) (f (- n 2))))) 4)', // fibonacci
  '(~ xyz . zyx ) 1 2 3', // TEST with singlelettervars set to true
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
  '(λ ab . + ab)',  // singleLetterVars : true
  'A (B +) C',
  '(+ A B)',
  '+ 555 6',
  '0',
  '1',
  '2',
  '3',
  '4',
  
  // invalid exprs
  '11111111111111111111111111111111111111111111111111', // TODO: fail on too much recursion or heap out of memory
  '(λ a b . + a b) )) abc', // TODO: one or more ) non matching         OK
  '((', // TODO: one or more missing `)`                                OK
  '( +', // TODO: one or more missing `)`                               OK
  '( 23', // TODO: one or more missing `)`                              OK
  '( a ( b )', // TODO: one or more missing `)`                         OK
  '( a ( b ', // TODO: one or more missing `)`                          OK
  '( a ( ', // TODO: one or more missing `)`                            OK
  '(', // TODO: one or more missing `)`                                 OK
  '(  )',// TODO: trying to parse empty expression - forbidden          OK

  // ] bracket
  '+ (+ 23 (- 42 23] 4', // OK
  '+ (+ 23 (- 42 23)) 4', // OK
  '(  ]', // SHOULD FAIL
  '(]', // SHOULD FAIL
  '( a ( ]', // SHOULD FAIL
  '( a ( b ]',
  '( a ( b )]',
  '( + ]',
  '( 23 ]',
  '(( a ]',

  // invalids
  // '(λ _x . x x)', // invalid cause of _x
  // 'A B C () E', // netusim jestli tohle chci mit jako validni NECHCI
  // 'A (B C) D ()', // ani tohle netusim NECHCI
]

console.log(inputs[0])

const tokens : Array<Token> = tokenize(inputs[0], {
  singleLetterVars : false,
  lambdaLetters : [ 'λ', '\\', '~' ],
})

console.log(tokens.map((token) => token.value).join(' '))

console.log('--------------------')

const ast : AST = Parser.parse(tokens, {})
let root : AST = ast
let e = 0

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
  const normal : NormalEvaluator = new NormalEvaluator(root)

  if (normal.nextReduction instanceof None) {
    break
  }

  root = normal.perform() // perform next reduction

  e++

  // console.log(printTree(root))
}




export function printTree (tree : AST) : string {
  const printer : BasicPrinter = new BasicPrinter(tree)
  return printer.print()
}


console.log('steps: ' + e)

console.log(printTree(root))
