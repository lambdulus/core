import { PositionRecord } from "./counter";


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