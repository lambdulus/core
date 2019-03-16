export { tokenize } from './lexer'
export { Token, TokenType } from './token'
export { InvalidIdentifier, InvalidNumber, InvalidOperator } from './errors'

// TODO: I may not need LambdaLetters - frontend could work that for me
export type CodeStyle = {
  singleLetterVars : boolean,
  lambdaLetters : Array<string>,
}