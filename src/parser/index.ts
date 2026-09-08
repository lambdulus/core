import { Token, CodeStyle, tokenize } from '../lexer'
import { Parser } from './parser'
import { AST, Application, Lambda, Variable } from '../ast'
import { OpenMacroDefinition } from './errors'

export { OpenMacroDefinition } from './errors'

export interface MacroMap {
  [ name : string ] : string
}

// Historical alias kept so existing imports keep working.
export type MacroTable = MacroMap

export const builtinMacros : MacroMap = {
  'Y' : '(λ f . (λ x . f (x x)) (λ x . f (x x)))',
  'ZERO' : '(λ n . n (λ x . (λ t f . f)) (λ t f . t))',
  'PRED' : '(λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))',
  'SUC' : '(λ n s z . s (n s z))',
  'AND' : '(λ x y . x y x)',
  'OR' : '(λ x y . x T y)',
  'OR2' : '(λ x y . x x y)',
  'T' : '(λ t f . t)',
  'F' : '(λ t f . f)',
  'NOT' : '(λ x t f . x f t)',
  'NOT2' : '(λ p . p F T)',
  '+' : '(λ x y s z . x s (y s z))',
  '-' : '(λ m n . (n PRED) m)',
  '*' : '(λ x y s . x (y s))',
  '/' : '(λ n k . Y (λ c n m f x . (λ d . ZERO d (0 f x) (f (c d m f x))) (- n m)) (SUC n) k)',
  '^' : '(λ x y . y x)',
  'DELTA' : '(λ m n . + (- m n) (- n m))',
  '=' : '(λ m n . ZERO (DELTA m n))',
  '>' : '(λ m n . NOT (ZERO (- m n)))',
  '<' : '(λ m n . > n m )',
  '>=' : '(λ m n . ZERO (- n m))',
  '<=' : '(λ m n . ZERO (- m n))',
}

// TODO: remove
// function toAst (definition : string, macroTable : MacroTable) : AST {
//   const codeStyle : CodeStyle = { singleLetterVars : false, lambdaLetters : [ 'λ' ], macromap : {} }
//   const parser : Parser = new Parser(tokenize(definition, codeStyle), macroTable)
  
//   return parser.parse(null)
// }

export function parse (tokens : Array<Token>, userMacros : MacroMap) : AST {
  const macroTable : MacroTable = {}

  // TODO: @dynamic-macros
  // TODO: tohle by eventuelne nebylo potreba delat - zbytecny kopirovani
  // na druhou stranu - macroTable slouci built-iny a user-definy takze asi proc ne?
  for (const [ name, definition ] of Object.entries(builtinMacros)) {
    // TODO: @dynamic-macros
    // macroTable[name] = new MacroDef(toAst(definition, macroTable))
    macroTable[name] = definition
  }

  for (const [ name, definition ] of Object.entries(userMacros)) {
    if (Object.prototype.hasOwnProperty.call(builtinMacros, name)) {
      throw new Error('Cannot redefine built-in Macro [ ' + name + ' ]')
    }

    // TODO: @dynamic-macros
    // macroTable[name] = new MacroDef(toAst(definition, macroTable))
    macroTable[name] = definition
  }

  const parser : Parser = new Parser(tokens, macroTable)

  return parser.parse(null)
}

// Parses one macro definition body and rejects open terms: a macro may
// only expand to a closed term, otherwise its free variables could be
// captured by lambdas at the use site. Macro references are meta-level
// (FreeVarsFinder ignores them), so aliases and recursion stay legal --
// only genuine free variables are reported. Throws OpenMacroDefinition.
export function parseMacroDefinition (name : string, tokens : Array<Token>, macroTable : MacroMap) : AST {
  const ast : AST = parse(tokens, macroTable)
  const freeVariables : Array<string> = freeVariablesOf(ast)

  if (freeVariables.length > 0) {
    throw new OpenMacroDefinition(name, freeVariables)
  }

  return ast
}

// Scope-correct free variables of a definition body: binders are counted
// so shadowing doesn't leak (the inner `n` of `/` must not unbind the
// outer one). FreeVarsFinder's name set over-reports under shadowing --
// safe for the evaluators' conservative renaming, but it would falsely
// reject closed macros here. Macro references are meta-level and carry
// no variables.
function freeVariablesOf (ast : AST) : Array<string> {
  const bound = new Map<string, number>()
  const free = new Set<string>()

  const visit = (node : AST) : void => {
    if (node instanceof Variable) {
      if ( ! bound.has(node.name())) {
        free.add(node.name())
      }
    }
    else if (node instanceof Lambda) {
      const argument : string = node.argument.name()
      bound.set(argument, (bound.get(argument) ?? 0) + 1)
      visit(node.body)
      const depth : number = (bound.get(argument) ?? 1) - 1
      if (depth <= 0) {
        bound.delete(argument)
      }
      else {
        bound.set(argument, depth)
      }
    }
    else if (node instanceof Application) {
      visit(node.left)
      visit(node.right)
    }
  }

  visit(ast)

  return Array.from(free).sort()
}

export default {
  parse
}