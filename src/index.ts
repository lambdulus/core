import tokenize, { Token } from './lexer'

const inputs : Array<string> = [
  '(λ ab . + ab)',  // singleLetterVars : true
  '(λ a b . + a b)',
  '+ (* 4 5) D',
  'A (B +) C',
  '+ (+ A B) C',
  '(+ A B)',
  '+ 555 6',
]

const tokens : Array<Token> = tokenize(inputs[0], {
  singleLetterVars : false,
  lambdaLetters : [ 'λ' ],
})

tokens.forEach(token => console.log(token))