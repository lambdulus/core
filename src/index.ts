import { inspect } from 'util'

import Lexer, { Token, tokenize } from './lexer'
import Parser, { AST, parse, ReductionResult } from './parser/parser'

export { Token, tokenize } from './lexer'
export { AST, ReductionResult } from './parser/parser'



const inputs : Array<string> = [
  '(Y (λ f n . (<= n 1) 1 (* n (f (- n 1))) ) 5)',
  '2 s z',
  '+ (* 4 5) D',
  'Y (λ f n . (< n 2) 1 (* n (f (- n 1))) ) 3',
  '(λ a b c d . - a b) 11 6 7 8',
  '+ (+ A B) C',
  '(λ ab . + ab)',  // singleLetterVars : true
  'A (B +) C',
  '(+ A B)',
  '+ 555 6',
 // 'A B C () E', // netusim jestli tohle chci mit jako validni
 // 'A (B C) D ()', // ani tohle netusim
]

const tokens : Array<Token> = Lexer.tokenize(inputs[0], {
  singleLetterVars : false,
  lambdaLetters : [ 'λ' ],
})

// tokens.forEach(token => console.log(token))
// console.log('--------------------------')

const ast : AST = Parser.parse(tokens)

// console.log()

// console.log(inspect(ast, false, null, true))

// console.log()

console.log(inputs[0])
// console.log(ast.print())

let i : AST = ast

let e = 0

while (true) {
  let { tree, reduced, reduction, currentSubtree } : ReductionResult = i.reduceNormal()
  // console.log()
  // console.log({ reduced, reduction })
  // console.log(tree.print())
  // console.log()

  i = tree
  e++

  if (reduced === false) break
}
console.log('steps: ' + e)
console.log(i.print())

