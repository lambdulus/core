import Lexer, { Token, CodeStyle } from '../lexer'
import { Parser } from './parser';
import { AST } from '../ast';
import { Application } from '../ast/application'
import { Lambda } from '../ast/lambda'
import { Macro } from '../ast/macro'
import { Variable } from '../ast/variable'

export class MacroDef {
  constructor (
    public readonly ast : AST,
  ) {}
}

export interface MacroTable {
  [ name : string ] : MacroDef
}

function toAst (definition : string, macroTable : MacroTable) : AST {
  const codeStyle : CodeStyle = { singleLetterVars : true, lambdaLetters : [ 'λ' ] }
  const parser : Parser = new Parser(Lexer.tokenize(definition, codeStyle), macroTable)
  
  return parser.parse(null)
}

// TODO: refactor macroTable for usage with user defined macro definitions
export function parse (tokens : Array<Token>) : AST {
  const macroTable : MacroTable = {}

  macroTable['Y'] = new MacroDef(toAst(`(λ f . (λ x . f (x x)) (λ x . f (x x)))`, macroTable)),

  macroTable['ZERO'] = new MacroDef(toAst(`(λ n . n (λ x . (λ t f . f)) (λ t f . t))`, macroTable)),
  
  macroTable['PRED'] = new MacroDef(toAst(`(λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))`, macroTable))
  macroTable['SUC'] = new MacroDef(toAst(`(λ n s z . s (n s z))`, macroTable))
    
  macroTable['AND'] = new MacroDef(toAst(`(λ x y . x y x)`, macroTable))
  macroTable['OR'] = new MacroDef(toAst(`(λ x y . x x y)`, macroTable))
  macroTable['NOT'] = new MacroDef(toAst(`(λ p . p F T)`, macroTable))
  
  macroTable['T'] = new MacroDef(toAst(`(λ t f . t)`, macroTable)),
  macroTable['F'] = new MacroDef(toAst(`(λ t f . f)`, macroTable)),
  
  macroTable['+'] = new MacroDef(toAst(`(λ x y s z . x s (y s z))`, macroTable)),
  macroTable['-'] = new MacroDef(toAst(`(λ m n . (n PRED) m)`, macroTable))
  macroTable['*'] = new MacroDef(toAst(`(λ x y z . x (y z))`, macroTable)),
  macroTable['/'] = new MacroDef(toAst(`(λ n . Y (λ c n m f x . (λ d . ZERO d (0 f x) (f (c d m f x))) (- n m)) (SUC n))`, macroTable))
  macroTable['^'] = new MacroDef(toAst(`(λ x y . x y)`, macroTable))
  
  macroTable['DELTA'] = new MacroDef(toAst(`(λ m n . + (- m n) (- n m))`, macroTable))
  
  macroTable['='] = new MacroDef(toAst(`(λ m n . ZERO (DELTA m n))`, macroTable))
  macroTable['>'] = new MacroDef(toAst(`(λ m n . NOT (ZERO (- m n)))`, macroTable))
  macroTable['<'] = new MacroDef(toAst(`(λ m n . > n m )`, macroTable))
  macroTable['>='] = new MacroDef(toAst(`(λ m n . ZERO (- n m))`, macroTable))
  macroTable['<='] = new MacroDef(toAst(`(λ m n . ZERO (- m n))`, macroTable))

  // QUICK MACROS - non recursively defined
  // macroTable['NOT'] = new MacroDef(toAst(`(λ p . p (λ t f . f) (λ t f . t))`, macroTable))
  // macroTable['-'] = new MacroDef(toAst(`(λ m n . (n (λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))) m)`, macroTable))
  // macroTable['/'] = new MacroDef(toAst(`(λ n . (λ f . (λ x . f (x x)) (λ x . f (x x))) (λ c n m f x . (λ d . (λ n . n (λ x . (λ t f . f)) (λ t f . t)) d (0 f x) (f (c d m f x))) ((λ m n . (n (λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))) m) n m)) ((λ n s z . s (n s z)) n))`, macroTable))
  // macroTable['DELTA'] = new MacroDef(toAst(`(λ m n . (λ x y s z . x s (y s z)) ((λ m n . (n (λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))) m) m n) ((λ m n . (n (λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))) m) n m))`, macroTable))
  // macroTable['='] = new MacroDef(toAst(`(λ m n . (λ n . n (λ x . (λ t f . f)) (λ t f . t)) ((λ m n . (λ x y s z . x s (y s z)) ((λ m n . (n (λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))) m) m n) ((λ m n . (n (λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))) m) n m)) m n))`, macroTable))
  // macroTable['>'] = new MacroDef(toAst(`(λ m n . (λ p . p (λ t f . f) (λ t f . t)) ((λ n . n (λ x . (λ t f . f)) (λ t f . t)) ((λ m n . (n (λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))) m) m n)))`, macroTable))
  // macroTable['<'] = new MacroDef(toAst(`(λ m n . (λ m n . (λ p . p (λ t f . f) (λ t f . t)) ((λ n . n (λ x . (λ t f . f)) (λ t f . t)) ((λ m n . (n (λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))) m) m n))) n m )`, macroTable))
  // macroTable['>='] = new MacroDef(toAst(`(λ m n . (λ n . n (λ x . (λ t f . f)) (λ t f . t)) (- n m))`, macroTable))  
  // macroTable['<='] = new MacroDef(toAst(`(λ m n . (λ n . n (λ x . (λ t f . f)) (λ t f . t)) ((λ m n . (n (λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))) m) m n))`, macroTable))

  const parser : Parser = new Parser(tokens, macroTable)

  return parser.parse(null)
}

export default {
  parse,
  Lambda,
  Variable,
  Macro,
  Application,
}