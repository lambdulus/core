import Lexer, { Token } from './lexer'
import Parser, { AST } from './parser'

import { NextNone, NextReduction } from './visitors'
import { BasicPrinter } from './visitors/basicprinter'
import { NormalEvaluator } from './visitors/normalevaluator'
import { Reducer } from './visitors/reducer';

export { Token, tokenize, default as Lexer } from './lexer'
export {
  parse,
  AST,
  default as Parser
} from './parser'


const inputs : Array<string> = [
  '((~ x y z . (~ y . y y) x x y y z) (x y z) A z)',
  '(~ n . (Y (~ f n a . (<= n 1) a (f (- n 1) (* n a)))) (- n 1) (n) ) 6', // factorial with accumulator
  '(Y (λ f n . (<= n 1) 1 (* n (f (- n 1))) ) 6)', // factorial without accumulator
  '(Y (λ f n . (= n 0) 0 ((= n 1) 1 ( + (f (- n 1)) (f (- n 2))))) 4)', // fibonacci 
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
  '(λ _x . x x)', // invalid cause of _x
 // 'A B C () E', // netusim jestli tohle chci mit jako validni NECHCI
 // 'A (B C) D ()', // ani tohle netusim NECHCI
]

console.log(inputs[0])


const tokens : Array<Token> = Lexer.tokenize(inputs[0], {
  singleLetterVars : false,
  lambdaLetters : [ 'λ', '\\', '~' ],
})

const ast : AST = Parser.parse(tokens)
let root : AST = ast
let e = 0

while (true) {
  // console.log('E ==== ', e)
  const normal : NormalEvaluator = new NormalEvaluator(root)

  if (normal.nextReduction instanceof NextNone) {
    break
  }

  // console.log('REDUCTION TYPE ', normal.nextReduction)

  const nextReduction : NextReduction = normal.nextReduction

  const reducer : Reducer = new Reducer(root, nextReduction)

  root = reducer.tree
  e++

  const printer : BasicPrinter = new BasicPrinter(root)
  const s = printer.print()
  console.log(s)

}


console.log('steps: ' + e)
const printer : BasicPrinter = new BasicPrinter(root)
const s = printer.print()
console.log(s)
