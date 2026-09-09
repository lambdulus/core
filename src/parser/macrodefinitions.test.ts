import { describe, expect, test } from 'vitest'

import { tokenize, CodeStyle, Token } from '../lexer'
import { parseMacroDefinition, OpenMacroDefinition, MacroMap, builtinMacros } from './index'

function style (names : MacroMap) : CodeStyle {
  return {
    singleLetterVars : true,
    lambdaLetters : [ 'λ' ],
    macromap : names,
  }
}

function define (name : string, body : string, names : MacroMap) : unknown {
  const tokens : Array<Token> = tokenize(body, style(names))
  return parseMacroDefinition(name, tokens, names)
}

const emptyNames : MacroMap = {}

describe('parseMacroDefinition', () => {
  test('open body throws naming the macro and its free variables', () => {
    try {
      define('TEST', 'x y', emptyNames)
      expect.unreachable('open macro definition was accepted')
    }
    catch (exception) {
      expect(exception).toBeInstanceOf(OpenMacroDefinition)
      const error = exception as OpenMacroDefinition
      expect(error.macroName).toBe('TEST')
      expect(error.freeVariables).toEqual([ 'x', 'y' ])
      expect(error.message).toContain('"TEST"')
      expect(error.message).toContain('x, y')
    }
  })

  test('closed lambda body is accepted', () => {
    expect(define('TEST', '(λ x y . x y)', emptyNames)).toBeDefined()
  })

  test('aliases and recursion stay legal, open recursion does not', () => {
    const names : MacroMap = { 'A' : '(λ x . x)', 'FOO' : '' }
    expect(define('B', 'A', names)).toBeDefined()
    expect(define('FOO', '(λ x . FOO x)', names)).toBeDefined()
    try {
      define('FOO', '(λ x . FOO y)', names)
      expect.unreachable('open recursive macro was accepted')
    }
    catch (exception) {
      expect(exception).toBeInstanceOf(OpenMacroDefinition)
      expect((exception as OpenMacroDefinition).freeVariables).toEqual([ 'y' ])
    }
  })

  test('shadowing does not leak binders', () => {
    // The inner `n` must not unbind the outer one (this is the shape of
    // the `/` builtin); only the genuinely free `y` is reported.
    expect(define('SHADOW', '(λ n . (λ n . n) n)', emptyNames)).toBeDefined()
    try {
      define('SHADOW', '(λ x . (λ x . y) x)', emptyNames)
      expect.unreachable('open shadowed macro was accepted')
    }
    catch (exception) {
      expect((exception as OpenMacroDefinition).freeVariables).toEqual([ 'y' ])
    }
  })

  test('unknown names count as free variables', () => {
    try {
      define('B', 'A', emptyNames)
      expect.unreachable('reference to unknown macro was accepted')
    }
    catch (exception) {
      expect(exception).toBeInstanceOf(OpenMacroDefinition)
      expect((exception as OpenMacroDefinition).freeVariables).toEqual([ 'A' ])
    }
  })

  test('all builtin macros are closed', () => {
    // The lexer needs the builtin names to recognize macro references,
    // while parse() picks up the built-in definitions itself.
    const names : MacroMap = Object.fromEntries(Object.keys(builtinMacros).map((name) => [ name, '' ]))
    for (const [ name, body ] of Object.entries(builtinMacros)) {
      const tokens : Array<Token> = tokenize(body, style(names))
      parseMacroDefinition(name, tokens, emptyNames)
    }
  })
})
