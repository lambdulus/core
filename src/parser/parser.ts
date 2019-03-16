import { Token, TokenType } from "../lexer";
import { MacroTable } from "./";
import { AST, Application, Lambda, ChurchNumber, Macro, Variable } from "../ast";


export class Parser {
  private position : number = 0

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

  accept (type : TokenType) : void {
    if (! this.canAccept(type)) {
      throw "Some Invalid token error"
    }

    this.position++
  }

  exprEnd () : boolean {
    return (
      this.position === this.tokens.length
        ||
      this.top().type === TokenType.RightParen
    )
  }

  parseLambda () : AST {
    const top : Token = this.top()
    switch (top.type) {
      case TokenType.Dot:
        this.accept(TokenType.Dot)
        
        return this.parse(null) // λ body

      case TokenType.Identifier:
        this.accept(TokenType.Identifier)
        
        const argument : Variable = new Variable(top)
        const body : AST = this.parseLambda()
        
        return new Lambda(argument, body)

      default:
        throw "Some invalid token error"
    }
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
    let top : Token = this.top()

    switch (top.type) {
      case TokenType.Number:
        this.accept(TokenType.Number)

        return new ChurchNumber(top)

      case TokenType.Operator:
        this.accept(TokenType.Operator)

        return new Macro(top, this.macroTable[top.value])
      
      case TokenType.Identifier:
        this.accept(TokenType.Identifier)

        if (this.isMacro(top)) {
          return new Macro(top, this.macroTable[top.value])
        }

        return new Variable(top)
      
      case TokenType.LeftParen:
        this.accept(TokenType.LeftParen)
        
        top = this.top()

        if (top.type === TokenType.Lambda) {
          this.accept(TokenType.Lambda)
          
          top = this.top()
          this.accept(TokenType.Identifier)

          const argument : Variable = new Variable(top)
          const body : AST = this.parseLambda()
          const lambda : AST = new Lambda(argument, body)
          this.accept(TokenType.RightParen)

          return lambda
        }
        else {
          // ( LEXPR )
          const expr : AST = this.parse(null)
          this.accept(TokenType.RightParen)

          return expr
        }

      default:
        throw "Some syntax error"
    }

  }

  /**
   * LEXPR := SINGLE { SINGLE }
   */
  parse (leftSide : AST | null, ) : AST {
    if (this.exprEnd()) {
      return <AST> leftSide // TODO: lefSide should never ever happen to be null -> check again
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