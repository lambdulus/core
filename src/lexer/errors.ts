import { PositionRecord } from "./position"


export class InvalidIdentifier extends Error {
  constructor (
    public readonly value : string,
    public readonly position : PositionRecord,
  ) { super() }
}

export class InvalidNumber extends Error {
  constructor (
    public readonly value : string,
    public readonly position : PositionRecord
  ) { super() }
}

export class InvalidOperator extends Error {
  constructor (
    public readonly value : string,
    public readonly position : PositionRecord
  ) { super() }
}

export class InvalidCharacter extends Error {
  constructor (
    public readonly value : string,
    public readonly position : PositionRecord
  ) { super() }
}

export function hintOperator (error : InvalidOperator, operators : Array<string>) : string {
  const { value : invalid } = error
  const relevant : Array<string> = operators.filter(
    (operator) =>
      operator.indexOf(invalid) !== -1
      ||
      invalid.indexOf(operator) !== -1
  )

  if ( ! relevant.length) {
    return ''
  }

  return (
    `Hint: Did you mean to write one of these?
    ${ relevant.map((operator) => `${ operator }\n`) }`
  )
}