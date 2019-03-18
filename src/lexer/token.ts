import { PositionRecord } from "./counter";


export enum TokenType {
  Lambda = 'lambda',
  Dot = 'dot',
  Identifier = 'identifier',
  Number = 'number',
  Operator = 'operator',
  LeftParen = 'left paren',
  RightParen = 'right paren',
  RightBracket = 'right bracket'
}

export class Token {
  constructor (
    public readonly type : TokenType,
    public readonly value : string | number,
    public readonly position : PositionRecord,
  ) {}
}