import readline from 'readline'

import { None } from './reductions'
import { NormalEvaluator, NormalAbstractionEvaluator, Evaluator } from './evaluators'
import { AST, Macro } from './ast'
import * as Parser from './parser/'
import { Token, tokenize } from './lexer'
import { BasicPrinter } from './visitors/basicprinter'
import { demoMacroTable } from './macros'

const lineReader = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

lineReader.on('line', (line) => {
  const macromap : Parser.MacroMap = demoMacroTable
  const tokens : Array<Token> = tokenize(line, {
    singleLetterVars : false,
    lambdaLetters : [ 'λ', '\\', '~' ],
    macromap,
  })
  
  const ast : AST = Parser.parse(tokens, macromap)
  let root : AST = ast
  let e = 0

  
  console.log(printTree(root))
  
  while (true) {
    const evaluator : Evaluator = new NormalEvaluator(root)

  
    if (evaluator.nextReduction instanceof None) {
      break
    }
  
    root = evaluator.perform() // perform next reduction
  
    e++
    console.log(printTree(root))
  }
  console.log('')
  console.log('Normalized in ' + e + ' steps.')
})

export function printTree (tree : AST) : string {
  const printer : BasicPrinter = new BasicPrinter(tree)
  return printer.print()
}