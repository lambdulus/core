export { tokenize } from './lexer'
export { Token, TokenType } from './token'
export {
  InvalidIdentifier,
  InvalidNumber,
  InvalidOperator,
  InvalidCharacter,
  hintOperator,
} from './errors'
export { BLANK_POSITION } from './position'

// TODO: I may not need LambdaLetters - frontend could work that for me
export type CodeStyle = {
  singleLetterVars : boolean,
  lambdaLetters : Array<string>,
}