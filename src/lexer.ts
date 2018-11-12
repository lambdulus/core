enum TokenType {
  Lambda, // = 0
  Dot, // = 1
  Identifier, // = 2 // Variable ?
  Macro, // = 3 // operators, numbers, booleans
  LeftParen, // = 4
  RightParen, // = 5
}

export class Token {
  constructor (
    public readonly type : TokenType,
    public readonly value : string,
    public readonly position : Position,
    ) {}
}

type CodeStyle = {
  singleLetterVars : boolean,
  lambdaLetters : Array<string>,
  macros : Array<string>,
}

function isWhiteSpace (char : string) : boolean {
  return (
    char === ' '
    ||
    char === '\n'
    ||
    char === '\t'
  )
}

function isRightParen (char : string) : boolean {
  return char === ')'
}

function isAlphabetic (char : string) : boolean {
  return (
    char >= 'a' && char <= 'z'
      ||
    char >= 'A' && char <= 'Z'
  )
}

function isNumeric (char : string) : boolean {
  return char >= '0' && char <= '9'
}

function readCharToken (source : Source, kind : TokenType) : Token {
  const { char, ...position } = source.shift()
  
  return new Token(kind, char, position)
}

function readLeftParen (source : Source) : Token {
  return readCharToken(source, TokenType.LeftParen)
}

function readRightParen (source : Source) : Token {
  return readCharToken(source, TokenType.RightParen)
}

function readDot (source : Source) : Token {
  return readCharToken(source, TokenType.Dot)
}

function readLambda (source : Source) : Token {
  return readCharToken(source, TokenType.Lambda)
}


class InvalidIdentifier extends Error {
  constructor (
    public readonly value : string,
    public readonly position : Position,
    ) { super() }
}

function readIdentifierOrMacro (source : Source, config : CodeStyle, isMacro : (string) => boolean) : Token {
  const identifier : Array<string> = []
  let { char : top, ...position } = source.shift()
  const { singleLetterVars : shortVars } = config
  let topPosition

  // alphabetic part
  while (isAlphabetic(top)) {
    if (shortVars) {
      return new Token(TokenType.Identifier, top, position)
    }

    identifier.push(top)
    ;({ char : top, ...topPosition } = source.shift())
  }

  // optional numeric part
  while (isNumeric(top)) {
    identifier.push(top)
    ;({ char : top, ...topPosition } = source.shift())
  }

  const id : string = identifier.join('')

    if ( ! isWhiteSpace(top) && ! isRightParen(top)) {
    throw new InvalidIdentifier(`${ id }${ top }`, position)
  }

  if (isMacro(id)) {
    return new Token(TokenType.Macro, id, position)
  }

  if (isRightParen(top)) {
    source.unshift({ char : top, ...topPosition })
  }

  return new Token(TokenType.Identifier, id, position)
}


class InvalidNumber extends Error {
  constructor (
    public readonly value : string,
    public readonly position : Position
    ) { super() }
}

function readNumber (source : Source) : Token {
  const number : Array<string> = []
  let { char : top, ...position } = source.shift()
  let topPosition

  while (isNumeric(top)) {
    number.push(top)
    ;({ char : top, ...topPosition } = source.shift())
  }

  const n : string = number.join('')

    if ( ! isWhiteSpace(top) && ! isRightParen(top)) {
    throw new InvalidNumber(`${ n }${ top }`, position)
  }

  if (isRightParen(top)) {
    source.unshift({ char : top, ...topPosition })
  }

  return new Token(TokenType.Macro, n, position)
}

class InvalidOperator extends Error {
  constructor (
    public readonly value : string,
    public readonly position : Position
    ) { super() }
}

function hintOperator (error : InvalidOperator, operators : Array<string>) : string {
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

function readOperator (source : Source, operators : Array<string>) : Token {
  const operator : Array<string> = []
  let { char : top, ...position } = source.shift()
  let topPosition

  // maybe also '(' i.e. +(EXPR) A                                      YES SHOULD BE
  // but then also +A B should be parsable                              NO SHOULD NOT BE
  // for now it will yield error and try to detect what went wrong
  // for now something like +3 would work,                              NO WONT BECAUSE I DECLARE OPERATORS
  // because user may be able to declare their own operator abstraction -
  // in this case probably function which sums 3 numbers

  while ( ! isWhiteSpace(top) && ! isRightParen(top)) {
    operator.push(top)
    ;({ char : top, ...topPosition } = source.shift())
  }

  const op = operator.join('')

  if (operators.indexOf(op) === -1) {
    throw new InvalidOperator(op, position)
  }

  if (isRightParen(top)) {
    source.unshift({ char : top, ...topPosition })
  }

  return new Token(TokenType.Macro, op, position)
}


type Source = Array<MarkedChar>

type MarkedChar = {
  char : string,
  row : number,
  column : number,
}

type Position = {
  row : number,
  column : number,
}

function markInput (input : string) : Array<MarkedChar> {
  const lines : Array<Array<string>> = input.split('\n').map((line : string) => Array.from(line))
  const marked : Array<Array<MarkedChar>> = lines.map(
    (line : Array<string>, row : number) =>
      line.map((char : string, column : number) =>
        ({ char, row, column, })
      )
  )
  const flat = [].concat(...marked)

  return flat
}

function skipOne (source : Array<MarkedChar>) : void {
  source.shift()
}

export default function tokenize (input : string, config : CodeStyle) : Array<Token> {
  const operators : Array<string> = [ '+', '-', '*', '/', ]
  const source : Array<MarkedChar> = markInput(input + ' ')
  const tokens : Array<Token> = []

  const { lambdaLetters, macros } = config

  const isLambda : (string) => boolean
    = (char) => lambdaLetters.indexOf(char) !== -1

  const isIdentifier : (string) => boolean
    = (char) => isAlphabetic(char)
  
  const isMacro : (string) => boolean
    = (id) => macros.indexOf(id) !== -1

  const isOperator : (string) => boolean
    = (char) => !! operators.find((operator) => char === operator[0])

  const isNumber : (string) => boolean
    = (char) => isNumeric(char)
  
  while (source.length) {
    const { char : current, ...position } = source[0]

    try {
      switch (true) {
        case isWhiteSpace(current) :
          skipOne(source)
          break
        case current === '(' :
          tokens.push(readLeftParen(source))
          break
        case current === ')' :
          tokens.push(readRightParen(source))
          break
        case current === '.' :
          tokens.push(readDot(source))
          break
        case isLambda(current) :
          tokens.push(readLambda(source))
          break
        case isIdentifier(current) :
          tokens.push(readIdentifierOrMacro(source, config, isMacro)) // transform IDs to Macros if needed
          break
        case isOperator(current) :
          tokens.push(readOperator(source, operators))
          break
        case isNumber(current) :
          tokens.push(readNumber(source))
          break
      
        default  :
          console.error(`Invalid character ${ current } \
          at row ${ position.row } column ${ position.column }.`)
      }
    }
    catch (error) {
      if (error instanceof InvalidNumber) {
        const { value, position } = error
        const { row, column } = position

        console.error(`Invalid character when expecting valid Number \
        at row ${ row } column ${ column }
        
        you probably misstyped ${ value }`)

        throw error
      }
      if (error instanceof InvalidOperator) {
        const { value, position } = error
        const { row, column } = position

        console.error(`Invalid character when expecting valid Operator \
        at row ${ row } column ${ column }

        you probably misstyped ${ value }
        
        ${ hintOperator(error, operators) }`)

        throw error
      }
      if (error instanceof InvalidIdentifier) {
        // TODO: implement

        throw error
      }
      throw error      
    }
   

  }


  return tokens
}
