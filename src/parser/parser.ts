import { Token, TokenType, BLANK_POSITION } from "../lexer"
import { MacroTable, parse, builtinMacros } from "./"
import { AST, Application, Lambda, ChurchNumeral, Macro, Variable } from "../ast"
import { UnexpectedToken, MacroAsArgument, UnmatchedParenthesis, MissingParenthesis, EmptyExpression } from "./errors"


export class Parser {
  private position : number = 0
  private openSubexpressions : number = 0

  private isMacro (token : Token) : boolean {
    return Object.prototype.hasOwnProperty.call(this.macroTable, token.value)
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
      throw new UnexpectedToken(`${ type }`)
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

    throw new UnexpectedToken('`)` or `]`')
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

  canAcceptClosing () : boolean {
    return (
      this.top().type === TokenType.RightParen
        ||
      this.top().type === TokenType.RightBracket
    )
  }

  allClosed () : boolean {
    return this.openSubexpressions === 0
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

      if (Object.prototype.hasOwnProperty.call(builtinMacros, id.value)) {
        throw new MacroAsArgument(`${ id.value }`)
      }

      const argument : Variable = new Variable(id)
      const body : AST = this.parseLambda()
      
      return new Lambda(argument, body)
    }

    throw new UnexpectedToken('either `.` or some Identifier', this.foundDescription())
  }

  /**
   * SINGLE
       := number 
       := operator 
       := ident
       := ( λ ident { ident } . LEXPR )
       := ( LEXPR )
       := '( LEXPR )
   */
  parseExpression () : AST {
    if (this.canAccept(TokenType.Number)) {
      const num : Token = this.accept(TokenType.Number)

      return new ChurchNumeral(num)
    }

    if (this.canAccept(TokenType.Operator)) {
      const op : Token = this.accept(TokenType.Operator)

      // TODO: @dynamic-macros
      return new Macro(op, this.macroTable)
    }

    if (this.canAccept(TokenType.Identifier)) {
      const id : Token = this.accept(TokenType.Identifier)

      if (this.isMacro(id)) {
        // TODO: @dynamic-macros
        return new Macro(id, this.macroTable)
      }

      return new Variable(id)
    }

    if (this.canAccept(TokenType.LeftParen)) {
      this.accept(TokenType.LeftParen)
      this.openSubexpressions++

      if (this.canAccept(TokenType.Lambda)) {
        this.accept(TokenType.Lambda)
          
        const id : Token = this.accept(TokenType.Identifier)

        if (Object.prototype.hasOwnProperty.call(builtinMacros, id.value)) {
          throw new MacroAsArgument(`${ id.value }`)
        }

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
    if (this.canAccept(TokenType.Quote)) {
      this.accept(TokenType.Quote)
      this.accept(TokenType.LeftParen)
      this.openSubexpressions++

      const expr : AST = this.parseQuoted()

      this.acceptClosing()

      return expr
    }

    throw new UnexpectedToken('one of: Number, Operator, Identifier or `(`', this.foundDescription())
  }

  // What the offending input looks like (without crashing at end of input,
  // where the old code died on undefined instead of reporting).
  private foundDescription () : string {
    return this.position < this.tokens.length ? `${ this.top().type }` : 'end of input'
  }

  /**
   * LEXPR := SINGLE { SINGLE }
   */
  parse (leftSide : AST | null, ) : AST {
    if (! this.eof() && this.canAcceptClosing() && this.allClosed()) {
      throw new UnmatchedParenthesis()
    }

    if (this.eof() && this.openSubexpressions !== 0) {
      throw new MissingParenthesis()
    }

    if (this.exprEnd()) {
      // if (! this.eof() && this.openSubexpressions === 0) {
      //   throw new UnmatchedParenthesis()
      // }

      // if (this.eof() && this.openSubexpressions !== 0) {
      //   throw new MissingParenthesis()
      // }
      if (leftSide === null) {
        throw new EmptyExpression(this.position)
      }

      return <AST> leftSide
      // TODO: lefSide should never ever happen to be null -> check again
      // TODO: it can be empty if parsing `( )` - handled
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

  parseQuoted () : AST {
    if (this.exprEnd()) {
      if (! this.eof() && this.openSubexpressions === 0) {
        throw new UnmatchedParenthesis()
      }

      if (this.eof() && this.openSubexpressions !== 0) {
        throw new MissingParenthesis()
      }

      return parse([new Token(TokenType.Identifier, 'NIL', BLANK_POSITION)], {})
    }
    else {
      // TODO: There would be real fun if I used parser itself to handle two of the applications.
      // like return Parser.parse(`${this.parseExpression()} CONS ${this.parseQuoted}`)
      const expr : AST = this.parseExpression()
      const left : AST = parse([new Token(TokenType.Identifier, 'CONS', BLANK_POSITION)], {})

      const app : AST = new Application(left, expr)
      return new Application(app, this.parseQuoted())
    }
  }
}