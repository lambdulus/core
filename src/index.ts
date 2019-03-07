import Lexer, { Token, tokenize } from './lexer'
import Parser, { AST, Binary, parse, NextReduction,
  NextAlpha,
  NextBeta,
  NextExpansion,
  NextNone,
  Child, } from './parser/parser'

import { Visitor, BasicPrinter, NormalEvaluation } from './visitors/visitor'

export { Token, tokenize, default as Lexer } from './lexer'
export {
  parse,
  AST,
  NextReduction,
  NextAlpha,
  NextBeta,
  NextExpansion,
  NextNone,
  Child,
  // ReductionResult,
  default as Parser
} from './parser/parser'



const inputs : Array<string> = [
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
  '(λ ab . + ab)',  // singleLetterVars : true
  'A (B +) C',
  '(+ A B)',
  '+ 555 6',
  '(λ _x . x x)', // invalid cause of _x
 // 'A B C () E', // netusim jestli tohle chci mit jako validni
 // 'A (B C) D ()', // ani tohle netusim
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
  const normal : NormalEvaluation = new NormalEvaluation(root)

  if (normal.nextReduction instanceof NextNone) {
    break
  }

  root = normal.evaluate()
  e++

  // const printer : BasicPrinter = new BasicPrinter(root)
  // const s = printer.print()
  // console.log(s)
}


console.log('steps: ' + e)
const printer : BasicPrinter = new BasicPrinter(root)
const s = printer.print()
console.log(s)
