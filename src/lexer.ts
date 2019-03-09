import Counter, { PositionRecord } from './counter'


export enum TokenType {
  Lambda = 'lambda',
  Dot = 'dot',
  Identifier = 'identifier',
  Number = 'number',
  Operator = 'operator',
  LeftParen = 'left paren',
  RightParen = 'right paren',
}

export class Token {
  constructor (
    public readonly type : TokenType,
    public readonly value : string | number,
    public readonly position : PositionRecord,
  ) {}
}


// TODO: I may not need LambdaLetters - frontend could work that for me
export type CodeStyle = {
  singleLetterVars : boolean,
  lambdaLetters : Array<string>,
}

class InvalidIdentifier extends Error {
  constructor (
    public readonly value : string,
    public readonly position : PositionRecord,
  ) { super() }
}

class InvalidNumber extends Error {
  constructor (
    public readonly value : string,
    public readonly position : PositionRecord
  ) { super() }
}

class InvalidOperator extends Error {
  constructor (
    public readonly value : string,
    public readonly position : PositionRecord
  ) { super() }
}


class Lexer {
  position : Counter = new Counter // TODO: replace with simple object or na, IDK

  tokens : Array<Token> = []

  constructor (
    readonly source : string,
    readonly config : CodeStyle,
  ) {}

  top () : string {
    return this.source[this.position.position]
  }

  pop () : string {
    const current : string = this.top()

    if (current === '\n') {
      this.position.newLine()
    }
    else {
      this.position.nextChar()
    }

    return current
  }

  isWhiteSpace (char : string) : boolean {
    return char.trim() !== char
  }

  isLeftParen (char : string) : boolean {
    return char === '('
  }

  isRightParen (char : string) : boolean {
    return char === ')'
  }

  isDot (char : string) : boolean {
    return char === '.'
  }

  isNumeric (char : string) : boolean {
    return char >= '0' && char <= '9'
  }

  isAlphabetic (char : string) : boolean {
    return (
      char >= 'a' && char <= 'z'
      ||
      char >= 'A' && char <= 'Z'
    )
  }

  getCharToken (kind : TokenType) : Token {
    const position : PositionRecord = this.position.toRecord()
    const char = this.pop()
    
    return new Token(kind, char, position)
  }
  
  readLeftParen () : void {
    const paren : Token = this.getCharToken(TokenType.LeftParen)

    this.tokens.push(paren)
  }

  readRightParen () : void {
    const paren : Token = this.getCharToken(TokenType.RightParen)

    this.tokens.push(paren)
  }

  readDot () : void {
    const dot : Token = this.getCharToken(TokenType.Dot)

    this.tokens.push(dot)
  }

  readLambda () : void {
    const lambda : Token = this.getCharToken(TokenType.Lambda)

    this.tokens.push(lambda)
  }

  readIdentifier () : void {
    let id : string = ''
    let topPosition = this.position.toRecord()
  
    // alphabetic part
    while (this.isAlphabetic(this.top())) {
      id += this.pop()

      // todo: implement this
      // v pripade single letter id - single alpha + any number of digit
      // if (this.config.singleLetterVars) {
      //   new Token(TokenType.Identifier, this.pop(), topPosition)
      // }
    }
  
    // optional numeric part
    while (this.isNumeric(this.top())) {
      id += this.pop()
    }
  
    // whitespace neni nutny
    // kontrolovat to co vadi [ alphabetic ]
    if (this.isAlphabetic(this.top())) {
      throw new InvalidIdentifier(`${ id }${ top }`, topPosition)
    }
  
    const identifier : Token = new Token(TokenType.Identifier, id, topPosition)

    this.tokens.push(identifier)
  }

  readNumber () : void {
    let n : number = 0
    let topPosition = this.position.toRecord()
  
    while (this.isNumeric(this.top())) {
      n = n * 10 + Number(this.pop())
    }
  
    if (this.isAlphabetic(this.top())) {
      throw new InvalidNumber(`${ n }${ top }`, topPosition)
    }
  
    
    const number : Token = new Token(TokenType.Number, n, topPosition)

    this.tokens.push(number)
  }

  mayBeLambda (char : string) : boolean {
    return this.config.lambdaLetters.indexOf(char) !== -1
  }

  mayBeIdentifier (char : string) : boolean {
    return this.isAlphabetic(this.top())
  }
 
  mayBeNumber (char : string) : boolean {
    return this.isNumeric(char)
  }

  tokenize () : Array<Token> {  
    while (this.position.position < this.source.length) {
      switch (this.top()) {
        case '(' :
          this.readLeftParen()
          break
        case ')' :
          this.readRightParen()
          break
        case '.' :
          this.readDot()
          break
        case '+' :
        case '-' :
        case '*' :
        case '/' :
        case '=' :
        case '^' : {
          const operator : string = this.pop()
          let topPosition : PositionRecord = this.position.toRecord()
                
          this.tokens.push(new Token(TokenType.Operator, operator, topPosition))
          break
        }
        case '<' :
        case '>' : {
          let operator : string = this.pop()
          let topPosition : PositionRecord = this.position.toRecord()
          
          if (this.top() === '=') {
            operator += this.pop()
          }

          this.tokens.push(new Token(TokenType.Operator, operator, topPosition))
          break
        }
        default  :
        if (this.mayBeNumber(this.top()))
          this.readNumber()
        else if (this.mayBeIdentifier(this.top()))
          this.readIdentifier()
        else if (this.mayBeLambda(this.top()))
          this.readLambda()
        else if (this.isWhiteSpace(this.top()))
          this.pop()
        else {
          // console.error(`Invalid character ${ this.position.toRecord() } \
          // at row ${ this.position.row } column ${ this.position.column }.`)

          // TODO: refactor
          // I need to send custom Error class containing all information in structured way not string
          throw(new Error(`Invalid character ${ this.position.toRecord() } \
          at row ${ this.position.row } column ${ this.position.column }.`))
        }
      }
      // TODO: implement error handling already
      // nechytat chybu tady
      // nechat ji probublat ven z tohohle modulu
      // odchyti si ji super modul kerej tohle pouziva
      // hint nech v erroru a super modul uz jenom vypise chybu a hint a zaformatuje
      // catch (error) {
      //   if (error instanceof InvalidNumber) {
      //     const { value } = error
      //     const { row, column } = this.position.toRecord()
  
      //     console.error(`Invalid character when expecting valid Number \
      //     at row ${ row } column ${ column }
          
      //     you probably misstyped ${ value }`)
      //   }
      //   if (error instanceof InvalidOperator) {
      //     const { value } = error
      //     const { row, column } = this.position.toRecord()
  
      //     console.error(`Invalid character when expecting valid Operator \
      //     at row ${ row } column ${ column }
  
      //     you probably misstyped ${ value }
          
      //     ${ hintOperator(error, this.operators) }`)
      //   }
      //   if (error instanceof InvalidIdentifier) {
      //     // TODO: implement
      //   }
      //   throw error      
      // }
    }

    return this.tokens
  }

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


export function tokenize (input : string, config : CodeStyle) : Array<Token> {
  const lexer : Lexer = new Lexer(input + ' ', config)

  return lexer.tokenize()
}

export default {
  tokenize,
}