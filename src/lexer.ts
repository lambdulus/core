import Counter, { PositionRecord } from './counter'


enum TokenType {
  Lambda, // = 0
  Dot, // = 1
  Identifier, // = 2 // variables, booleans
  Number, // = 3 // numbers
  Operator, // = 4 operators
  LeftParen, // = 5
  RightParen, // = 6
}

export class Token {
  constructor (
    public readonly type : TokenType,
    public readonly value : string | number,
    public readonly position : PositionRecord,
    ) {}
}

type CodeStyle = {
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
  readonly operators : Array<string> = [ '+', '-', '*', '/', ]

  position : Counter = new Counter

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

  isWhiteSpace () : boolean {
    const top = this.top()

    return top.trim() !== top
  }

  isLeftParen () : boolean {
    return this.top() === '('
  }

  isRightParen () : boolean {
    return this.top() === ')'
  }

  isDot () : boolean {
    return this.top() === '.'
  }

  isNumeric () : boolean {
    const top : string = this.top()

    return top >= '0' && top <= '9'
  }

  isAlphabetic () : boolean {
    const top : string = this.top()

    return (
      top >= 'a' && top <= 'z'
        ||
        top >= 'A' && top <= 'Z'
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
    while (this.isAlphabetic()) {
      // if (this.config.singleLetterVars) {
      //   return new Token(TokenType.Identifier, top, position)
      // }
      // v pripade single letter id - single alpha + any number of digit
      id += this.pop()
    }
  
    // optional numeric part
    while (this.isNumeric()) {
      id += this.pop()
    }
  
    // whitespace neni nutny
    // kontrolovat to co vadi [ alphabetic ]
    if (this.isAlphabetic()) {
      throw new InvalidIdentifier(`${ id }${ top }`, topPosition)
    }
  
    const identifier : Token = new Token(TokenType.Identifier, id, topPosition)

    this.tokens.push(identifier)
  }

  readNumber () : void {
    // decimalni build rovnou cisla zadny pole, zadny string
    let n : number = 0
    let topPosition = this.position.toRecord()
  
    while (this.isNumeric()) {
      n = n * 10 + Number(this.pop())
    }
  
    if (this.isAlphabetic()) {
      throw new InvalidNumber(`${ n }${ top }`, topPosition)
    }
  
    
    const number : Token = new Token(TokenType.Number, n, topPosition)

    this.tokens.push(number)
  }

  // delte uplne nahradit ve switchy
  // readOperator () : void {
  //   const operator : Array<string> = []
  //   let topPosition : PositionRecord = this.position.toRecord()

  //   // maybe also '(' i.e. +(EXPR) A                                      YES SHOULD BE
  //   // but then also +A B should be parsable                              NO SHOULD NOT BE
  //   // for now it will yield error and try to detect what went wrong
  //   // for now something like +3 would work,                              NO WONT BECAUSE I DECLARE OPERATORS
  //   // because user may be able to declare their own operator abstraction -
  //   // in this case probably function which sums 3 numbers
  

  //   while ( ! this.isWhiteSpace() && ! this.isRightParen()) {
  //     operator.push(this.pop())
  //   }
  
  //   const op = operator.join('')
  
  //   if (this.operators.indexOf(op) === -1) {
  //     throw new InvalidOperator(op, topPosition)
  //   }
  
  //   this.tokens.push(new Token(TokenType.Operator, op, topPosition))
  // }


  mayBeLambda () : boolean {
    const top = this.top()
    
    return this.config.lambdaLetters.indexOf(top) !== -1
  }

  mayBeIdentifier () : boolean {
    return this.isAlphabetic()
  }
  
  mayBeOperator () : boolean {
    const top = this.top()

    return !! this.operators.find((operator) => top === operator[0])
  }
 
  mayBeNumber () : boolean {
    return this.isNumeric()
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
          const operator : string = this.pop()
          let topPosition : PositionRecord = this.position.toRecord()
                
          this.tokens.push(new Token(TokenType.Operator, operator, topPosition))
          break
        default  :
        if (this.mayBeNumber())
          this.readNumber()
        if (this.mayBeIdentifier())
          this.readIdentifier()
        if (this.mayBeLambda())
          this.readLambda()
        if (this.isWhiteSpace())
          this.pop()
        else
          console.error(`Invalid character ${ this.position.toRecord } \
          at row ${ this.position.row } column ${ this.position.column }.`)
      }
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


export default function tokenize (input : string, config : CodeStyle) : Array<Token> {
  const lexer : Lexer = new Lexer(input + ' ', config)

  return lexer.tokenize()
}
