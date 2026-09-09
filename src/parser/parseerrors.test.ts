import { describe, expect, test } from 'vitest'

import { tokenize, CodeStyle, Token, TokenType } from '../lexer'
import { parse, MacroMap } from './index'
import { Parser } from './parser'
import {
  UnexpectedToken,
  MacroAsArgument,
  UnmatchedParenthesis,
  MissingParenthesis,
  EmptyExpression,
  RedefinedBuiltinMacro,
} from './errors'

const style : CodeStyle = {
  singleLetterVars : true,
  lambdaLetters : [ 'λ' ],
  macromap : {},
}

function tokens (source : string) : Array<Token> {
  return tokenize(source, style)
}

function failsWith<T> (source : string, table : MacroMap, Ctor : new (...args : Array<any>) => T) : T {
  try {
    parse(tokens(source), table)
    expect.unreachable(`parsing '${ source }' was accepted`)
  }
  catch (exception) {
    expect(exception).toBeInstanceOf(Ctor)
    return exception as T
  }
}

describe('parser errors', () => {
  test('accept reports the expected token kind', () => {
    const parser : Parser = new Parser(tokens('x'), {})
    try {
      parser.accept(TokenType.RightParen)
      expect.unreachable('acceptance succeeded')
    }
    catch (exception) {
      expect(exception).toBeInstanceOf(UnexpectedToken)
      const error = exception as UnexpectedToken
      expect(error.expected).toBe('right paren')
      expect(error.message).toBe('Was expecting right paren')
    }
  })

  test('missing closer reports end of input instead of crashing', () => {
    const error = failsWith('(λ x', {}, UnexpectedToken)
    expect(error.expected).toBe('either `.` or some Identifier')
    expect(error.message).toBe('Was expecting either `.` or some Identifier, but got end of input')
  })

  test('builtin macro as an argument name is reported', () => {
    const error = failsWith('(λ Y . Y)', {}, MacroAsArgument)
    expect(error.macroName).toBe('Y')
    expect(error.message).toBe('Known Macro name can not stand as an argument name.')
  })

  test('stray closers and missing closers are told apart', () => {
    const unmatched = failsWith('x )', {}, UnmatchedParenthesis)
    expect(unmatched.message).toBe('It seems you have one or more closing parenthesis not matching.')
    const missing = failsWith('((x)', {}, MissingParenthesis)
    expect(missing.message).toBe('It seems like you forgot to write one or more closing parentheses.')
  })

  test('empty input is reported with its position', () => {
    const error = failsWith('', {}, EmptyExpression)
    expect(error.position).toBe(0)
    expect(error.message).toContain('empty expression')
  })

  test('redefining a builtin names the macro', () => {
    const error = failsWith('Y', { 'Y' : '(λ x . x)' }, RedefinedBuiltinMacro)
    expect(error.macroName).toBe('Y')
    expect(error.message).toBe('Cannot redefine built-in Macro [ Y ]')
  })
})
