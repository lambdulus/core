import { describe, expect, test } from 'vitest'

import { tokenize, CodeStyle } from '../lexer'
import { parse } from '../parser'
import { FreeVarsFinder } from './freevarsfinder'

const style : CodeStyle = {
  singleLetterVars : true,
  lambdaLetters : [ 'λ' ],
  macromap : {},
}

function freeOf (source : string) : Array<string> {
  const ast = parse(tokenize(source, style), {})
  return Array.from(new FreeVarsFinder(ast).freeVars).sort()
}

describe('FreeVarsFinder', () => {
  test('plain open and closed terms', () => {
    expect(freeOf('x y')).toEqual([ 'x', 'y' ])
    expect(freeOf('(λ x y . x y)')).toEqual([])
  })

  test('shadowing does not leak binders', () => {
    // The inner `n` must not unbind the outer one for the later use;
    // only the genuinely free `y` is reported.
    expect(freeOf('(λ n . (λ n . n) n)')).toEqual([])
    expect(freeOf('(λ x . (λ x . y) x)')).toEqual([ 'y' ])
  })
})
