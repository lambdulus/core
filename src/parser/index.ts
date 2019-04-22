import { Token, CodeStyle, tokenize } from '../lexer'
import { Parser } from './parser';
import { AST, Application, Lambda, Macro, Variable } from '../ast';


export class MacroDef {
  constructor (
    public readonly ast : AST,
  ) {}
}

export interface MacroTable {
  [ name : string ] : MacroDef
}

export interface MacroMap {
  [ name : string ] : string
}

export const builtinMacros : MacroMap = {
  'Y' : '(λ f . (λ x . f (x x)) (λ x . f (x x)))',
  'Z' : '(λ f . (λ y . f (λ z . y y z)) (λ y . f (λ z . y y z)))',
  'ZERO' : '(λ n . n (λ x . (λ t f . f)) (λ t f . t))',
  'PRED' : '(λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))',
  'SUC' : '(λ n s z . s (n s z))',
  'AND' : '(λ x y . x y x)',
  'OR' : '(λ x y . x x y)',
  'T' : '(λ t f . t)',
  'F' : '(λ t f . f)',
  'NOT' : '(λ p . p F T)',
  // 'NOT' : '(λ p a b . p b a)',
  // 'NOTapp' : '(λ p a b . p b a)',
  '+' : '(λ x y s z . x s (y s z))',
  '-' : '(λ m n . (n PRED) m)',
  '*' : '(λ x y z . x (y z))',
  '/' : '(λ n . Y (λ c n m f x . (λ d . ZERO d (0 f x) (f (c d m f x))) (- n m)) (SUC n))',
  '^' : '(λ x y . y x)',
  'DELTA' : '(λ m n . + (- m n) (- n m))',
  '=' : '(λ m n . ZERO (DELTA m n))',
  '>' : '(λ m n . NOT (ZERO (- m n)))',
  '<' : '(λ m n . > n m )',
  '>=' : '(λ m n . ZERO (- n m))',
  '<=' : '(λ m n . ZERO (- m n))',
  'IF' : '(λ p t e . p t e)',
  'PAIR' : '(λ f s . (λ g . g f s))',
  'FIRST' : '(λ p . p (λ f s . f))',
  'SECOND' : '(λ p . p (λ f s . s))',
  
  'CONS' : '(λ car cdr . (λ g . g car cdr))',
  'NIL' : '(λx. T)',
  'NULL' : '(λp.p (λx y.F))',
  'SHORTLIST' : '(CONS 3 (CONS 5 (CONS 1 (CONS 10 (CONS 7 (CONS 2 (CONS 4 (CONS 9 (CONS 4 (CONS 6 (CONS 8 NIL)))))))))))',
  'MESSLIST' :  '(CONS 3 (CONS 5 (CONS 1 (CONS 10 (CONS 7 (CONS 2 (CONS 4 (CONS 9 (CONS 4 (CONS 6 (CONS 8 NIL)))))))))))',
  'LISTGREQ' : 'Y (λ fn piv list . IF (NULL list) (NIL) ( IF (>= (FIRST list) piv) (CONS (FIRST list) (fn piv (SECOND list))) (fn piv (SECOND list)) ) )',
  'LISTLESS' : 'Y (λ fn piv list . IF (NULL list) (NIL) ( IF (< (FIRST list) piv) (CONS (FIRST list) (fn piv (SECOND list))) (fn piv (SECOND list)) ) )',
  'LISTGR' : 'Y (λ fn piv list . IF (NULL list) (NIL) ( IF (> (FIRST list) piv) (CONS (FIRST list) (fn piv (SECOND list))) (fn piv (SECOND list)) ) )',
  'LISTEQ' : 'Y (λ fn piv list . IF (NULL list) (NIL) ( IF (= (FIRST list) piv) (CONS (FIRST list) (fn piv (SECOND list))) (fn piv (SECOND list)) ) )',
  'CONNECT' : 'Y (λ fn listA listB . IF (NULL listA) (listB) (CONS (FIRST listA) (fn (SECOND listA) listB)))',
  'QUICKSORT' : 'Y (λ fn list . IF (NULL list) (NIL) ( IF (NULL (SECOND list)) (list) ( CONNECT (fn (LISTLESS (FIRST list) list)) ( CONNECT (LISTEQ (FIRST list) list) (fn (LISTGR (FIRST list) list)) ) ) ) )',
  '::' : 'CONS',
}

function toAst (definition : string, macroTable : MacroTable) : AST {
  const codeStyle : CodeStyle = { singleLetterVars : false, lambdaLetters : [ 'λ' ] }
  const parser : Parser = new Parser(tokenize(definition, codeStyle), macroTable)
  
  return parser.parse(null)
}

// TODO: refactor macroTable for usage with user defined macro definitions
export function parse (tokens : Array<Token>, userMacros : MacroMap) : AST {
  const macroTable : MacroTable = {}

  for (const [ name, definition ] of Object.entries(builtinMacros)) {
    macroTable[name] = new MacroDef(toAst(definition, macroTable))
  }

  // TODO: chtel bych LIST, CONS, APPEND, GET NTH ITEM, MAP, ...

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

  for (const [ name, definition ] of Object.entries(userMacros)) {
    if (name in builtinMacros) {
      // TODO: maybe dont throw? better throw, just to be sure :D
      // zvazit - dovoluju predefinovat cisla
      throw new Error('Cannot redefine built-in Macro ' + name)
    }
    macroTable[name] = new MacroDef(toAst(definition, macroTable))
  }

  const parser : Parser = new Parser(tokens, macroTable)

  return parser.parse(null)
}

// TODO: delete?
export default {
  parse,
  Lambda,
  Variable,
  Macro,
  Application,
}