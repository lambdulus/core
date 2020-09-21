import { Counter } from './counter'
import { Token, TokenType, CodeStyle, InvalidIdentifier, InvalidNumber, InvalidOperator } from './'
import { InvalidCharacter } from './errors'
import { PositionRecord } from './position'
import { builtinMacros } from '../parser'


class Lexer {
  public position : Counter = new Counter

  public tokens : Array<Token> = []

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

  couldBeMacro (str : string) : boolean {
    const delimiter : string = ':'
    const allMacros : string = [...Object.keys(builtinMacros), ...Object.keys(this.config.macromap)].join(delimiter)

    return allMacros.indexOf(':' + str) !== -1
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

  readRightBracket () : void {
    const bracket : Token = this.getCharToken(TokenType.RightBracket)

    this.tokens.push(bracket)
  }

  readDot () : void {
    const dot : Token = this.getCharToken(TokenType.Dot)

    this.tokens.push(dot)
  }

  readLambda () : void {
    const lambda : Token = this.getCharToken(TokenType.Lambda)

    this.tokens.push(lambda)
  }

  readSLINonMacro (id : string, position : PositionRecord) : void {
    const chars : Array<string> = id.split('')

    if (this.isNumeric(id[id.length - 1])) {
      if (this.isNumeric(id[id.length - 2])) {
        throw new InvalidIdentifier(`${ id }`, position)
      }
      else {
        const numericPart : string = chars.pop() as string // I know it will be there
        chars[chars.length - 1] += numericPart

        
      }
    }
    // else and also if
    chars.forEach((id : string, i : number) =>
      this.tokens.push(new Token(TokenType.Identifier, id, position)))
    // TODO: position is not correct - fix this!

    let topPosition = this.position.toRecord()

    while (this.isAlphabetic(this.top())) {
      id = this.pop()

      if (this.isNumeric(this.top())) {
        id += this.pop()
      }

      const identifier : Token = new Token(TokenType.Identifier, id, topPosition)
      this.tokens.push(identifier)
    }

    if (this.isNumeric(this.top())) {
      throw new InvalidIdentifier(`${ id }`, topPosition)
    }
  }

  readIdentifier () : void {
    let id : string = ''
    let topPosition = this.position.toRecord()
  
    if (this.config.singleLetterVars) {
      while (this.isAlphabetic(this.top())) {
        id += this.pop()

        if (this.isNumeric(this.top())) {
          id += this.pop()
        }

        if (id in builtinMacros && this.isWhiteSpace(this.top())) {
          // normalne vytvorit id -> vynulovat -> pushnout
          const identifier : Token = new Token(TokenType.Identifier, id, topPosition)
          id = ''
          this.tokens.push(identifier)
          continue
        }
        else if (this.couldBeMacro(id)) {
          continue
        }
        else {
          this.readSLINonMacro(id, topPosition)
          id = ''
        }
      }

      if (id !== '') {
        const identifier : Token = new Token(TokenType.Identifier, id, topPosition)
        id = ''
        this.tokens.push(identifier)
      }

      if (this.isNumeric(this.top())) {
        throw new InvalidIdentifier(`${ id }`, topPosition)
      }
      return
    }

    // alphabetic part
    while (this.isAlphabetic(this.top())) {
      id += this.pop()
    }
  
    // optional numeric part
    while (this.isNumeric(this.top())) {
      id += this.pop()
    }
  
    if (this.isAlphabetic(this.top())) {
      throw new InvalidIdentifier(`${ id }`, topPosition)
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
      throw new InvalidNumber(`${ n }${ this.top() }`, topPosition)
    }
  
    const number : Token = new Token(TokenType.Number, n, topPosition)

    this.tokens.push(number)
  }

  mayBeLambda (char : string) : boolean {
    return this.config.lambdaLetters.indexOf(char) !== -1
  }

  mayBeIdentifier (char : string) : boolean {
    return this.isAlphabetic(char)
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
        case ']' :
          this.readRightBracket()
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
          const topPosition : PositionRecord = this.position.toRecord()
                
          this.tokens.push(new Token(TokenType.Operator, operator, topPosition))
          break
        }
        case '<' :
        case '>' : {
          let operator : string = this.pop()
          const topPosition : PositionRecord = this.position.toRecord()
          
          if (this.top() === '=') {
            operator += this.pop()
          }

          this.tokens.push(new Token(TokenType.Operator, operator, topPosition))
          break
        }
        case '\'' : {
          const operator : string = this.pop()
          const topPosition : PositionRecord = this.position.toRecord()

          this.tokens.push(new Token(TokenType.Quote, operator, topPosition))
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
          throw new InvalidCharacter(`${this.top()}`, this.position.toRecord())
        }
      }
    }

    return this.tokens
  }

}

export function tokenize (input : string, config : CodeStyle) : Array<Token> {
  const lexer : Lexer = new Lexer(input + ' ', config)

  return lexer.tokenize()
}