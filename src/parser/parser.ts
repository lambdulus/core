import { Token, TokenType } from "../lexer";
import { MacroTable } from "./";
import { AST, Application, Lambda, ChurchNumber, Macro, Variable } from "../ast";


export class Parser {
  private position : number = 0
  private openSubexpressions : number = 0

  private isMacro (token : Token) : boolean {
    return token.value in this.macroTable
  }

  constructor (
    private readonly tokens : Array<Token>,
    private readonly macroTable : MacroTable,
  ) {}

  top () : Token {
    return this.tokens[this.position]
  }

  canAccept (type : TokenType) : boolean {
    return (
      this.position < this.tokens.length
        &&
      this.top().type == type
    )
  }

  accept (type : TokenType) : Token {
    if (! this.canAccept(type)) {
      throw "Was expecting " + type
    }

    const top : Token = this.top()

    this.position++

    return top
  }

  acceptClosing () : void {
    if (this.canAccept(TokenType.RightParen)) {
      this.openSubexpressions--
      this.accept(TokenType.RightParen)
      return
    }

    if (this.canAccept(TokenType.RightBracket)) {
      if (this.openSubexpressions > 1) {
        this.openSubexpressions--
        return
      }
      else {
        this.openSubexpressions--
        this.accept(TokenType.RightBracket)
        return
      }
    }

    throw "Was expecting `)` or `]`" 
  }

  exprEnd () : boolean {
    return (
      this.position === this.tokens.length
        ||
      this.top().type === TokenType.RightParen
        ||
      this.top().type === TokenType.RightBracket
    )
  }

  eof () : boolean {
    return this.position === this.tokens.length
  }

  parseLambda () : AST {
    if (this.canAccept(TokenType.Dot)) {
      this.accept(TokenType.Dot)

      return this.parse(null) // λ body
    }

    if (this.canAccept(TokenType.Identifier)) {
      const id : Token = this.accept(TokenType.Identifier)

      const argument : Variable = new Variable(id)
      const body : AST = this.parseLambda()
      
      return new Lambda(argument, body)
    }

    throw "Was expecting either `.` or some Identifier, but got " + this.top().type
  }

  /**
   * SINGLE
       := number 
       := operator 
       := ident
       := '(' λ ident { ident } '.' LEXPR ')'
       := '(' LEXPR ')'
   */
  parseExpression () : AST {
    if (this.canAccept(TokenType.Number)) {
      const num : Token = this.accept(TokenType.Number)

      return new ChurchNumber(num)
    }

    if (this.canAccept(TokenType.Operator)) {
      const op : Token = this.accept(TokenType.Operator)

      return new Macro(op, this.macroTable[op.value])
    }

    if (this.canAccept(TokenType.Identifier)) {
      const id : Token = this.accept(TokenType.Identifier)

      if (this.isMacro(id)) {
        return new Macro(id, this.macroTable[id.value])
      }

      return new Variable(id)
    }

    if (this.canAccept(TokenType.LeftParen)) {
      this.accept(TokenType.LeftParen)
      this.openSubexpressions++

      if (this.canAccept(TokenType.Lambda)) {
        this.accept(TokenType.Lambda)
          
        const id : Token = this.accept(TokenType.Identifier)

        const argument : Variable = new Variable(id)
        const body : AST = this.parseLambda()
        const lambda : AST = new Lambda(argument, body)

        this.acceptClosing()

        return lambda
      }
      else { // ( LEXPR )
        const expr : AST = this.parse(null)

        this.acceptClosing()

        return expr
      }
    }

    throw "Was expecting one of: Number, Operator, Identifier or `(` but got " + this.top().type
  }

  /**
   * LEXPR := SINGLE { SINGLE }
   */
  parse (leftSide : AST | null, ) : AST {
    // TODO: refactor error catching - this if if if is insane


    // TODO: uvaha
    // pokud se nachazim na top level urovni a narazim na zaviraci zavorku
    // striktne receno - pokud je pocet mejch otevrenejch zavorek 0
    // a narazim na zaviraci zavorku, tak je neco spatne
    if (this.exprEnd()) {
      if (! this.eof() && this.openSubexpressions === 0) {
        throw "It seems you have one or more closing parenthesis non matching."
      }

      // TODO: taky by bylo fajn rict, kde
      if (this.eof() && this.openSubexpressions !== 0) {
        throw "It seems like you forgot to write one or more closing parentheses."
      }
      if (leftSide === null) {
        throw "You are trying to parse empty expression, which is forbidden. " +
        "Check your λ expression for empty perenthesis."
      }
      return <AST> leftSide
      // TODO: lefSide should never ever happen to be null -> check again
      // TODO: it can be empty if parsing `( )`
      // could it be caught by simply checking if leftSide is never null in this place?
    }
    else {
      const expr : AST = this.parseExpression()
      
      if (leftSide === null) {
        return this.parse(expr)
      }
      else {
        const app : AST = new Application(leftSide, expr)
        return this.parse(app)
      }
    }
  }
}