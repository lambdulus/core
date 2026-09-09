import { describe, expect, test } from 'vitest'

import { tokenize } from '../lexer'
import { parse } from '../parser'
import { Gama } from '../reductions'
import { constructFor } from './index'
import { InvalidReductionArguments } from './errors'

describe('reducer errors', () => {
  test('unknown gama abstraction is reported', () => {
    const tree = parse(tokenize('x', { singleLetterVars : true, lambdaLetters : [ 'λ' ], macromap : {} }), {})
    const reduction = new Gama([], [], null, null, [ 'NOPE', 0 ])
    try {
      constructFor(tree, reduction)
      expect.unreachable('reducer construction succeeded')
    }
    catch (exception) {
      expect(exception).toBeInstanceOf(InvalidReductionArguments)
      const error = exception as InvalidReductionArguments
      expect(error.reduction).toBe('NOPE')
      expect(error.message).toBe('Invalid arguments of NOPE.')
    }
  })
})
