// import { inspect } from 'util'

import Lexer, { Token, tokenize } from './lexer'
import Parser, { AST, Binary, parse, ReductionResult, NextReduction,
  NextAlpha,
  NextBeta,
  NextExpansion,
  NextNone,
  Child, } from './parser/parser'

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
  ReductionResult,
  default as Parser
} from './parser/parser'



const inputs : Array<string> = [
  '(Y (λ f n . (<= n 1) 1 (* n (f (- n 1))) ) 5)',
  '^ 4 4',
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

// while (true) {
//   let { tree, reduced, reduction, currentSubtree } : ReductionResult = i.reduceNormal()
//   // console.log()
//   // console.log({ reduced, reduction })
//   // console.log(tree.print())
//   // console.log()

//   i = tree
//   e++

//   if (reduced === false) break
// }

while (true) {
  const nextReduction : NextReduction = i.nextNormal(null, null)

  if (nextReduction instanceof NextAlpha) {
    const { tree, child, oldName, newName } = nextReduction
    tree[<Child> child] = tree[<Child> child].alphaConvert(oldName, newName)
  }
  
  else if (nextReduction instanceof NextBeta) {
    const { parent, treeSide, target, argName, value } = nextReduction
    const substituted : AST = target.betaReduce(argName, value)

    if (parent === null) {
      i = substituted
    }
    else {
      parent[<Child> treeSide] = substituted
    }
  }

  else if (nextReduction instanceof NextExpansion) {
    const { parent, treeSide, tree } = nextReduction
    const expanded : AST = tree.expand()

    if (parent === null) {
      i = expanded
    }
    else {
      parent[<Child> treeSide] = expanded
    }
  }
  else { // instanceof NextNone
    e++
    break
  }
  
  e++
}


console.log('steps: ' + e)
console.log(i.print())