import Lexer, { Token, TokenType, CodeStyle } from '../lexer'
import { Lambda } from './ast/lambda'
import { Variable } from './ast/variable'
import { Macro } from './ast/macro'
import { ChurchNumber } from './ast/churchnumber'
import { Application } from './ast/application'
import { Visitable } from '../visitors/visitor'

// TODO: tak tohle zrusime nahradime logikou visitor patternu
export interface Binary extends AST {
  left : AST,
  right : AST,
}

export interface AST extends Visitable {
  identifier : symbol,
  clone () : AST,
  alphaConvert (oldName : string, newName : string) : AST,
  betaReduce (argName : string, value : AST) : AST,
  etaConvert () : AST,
  freeVarName (bound : Array<string>) : string | null, // TODO: consider refactoring to visitor pattern
}

export interface Expandable {
  expand () : AST,
}

export class MacroDef {
  constructor (
    public readonly ast : AST,
  ) {}
}

export interface MacroTable {
  [ name : string ] : MacroDef
}

function toAst (definition : string, macroTable : MacroTable) : AST {
  const codeStyle : CodeStyle = { singleLetterVars : true, lambdaLetters : [ 'λ' ] }
  const parser : Parser = new Parser(Lexer.tokenize(definition, codeStyle), macroTable)
  
  return parser.parse(null)
}

class Parser {
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
        ||
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

// TODO: refactor macroTable for usage with user defined macro definitions
export function parse (tokens : Array<Token>) : AST {
  const macroTable : MacroTable = {}

  macroTable['Y'] = new MacroDef(toAst(`(λ f . (λ x . f (x x)) (λ x . f (x x)))`, macroTable)),

  macroTable['ZERO'] = new MacroDef(toAst(`(λ n . n (λ x . (λ t f . f)) (λ t f . t))`, macroTable)),
  
  macroTable['PRED'] = new MacroDef(toAst(`(λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))`, macroTable))
  macroTable['SUC'] = new MacroDef(toAst(`(λ n s z . s (n s z))`, macroTable))
    
  macroTable['AND'] = new MacroDef(toAst(`(λ x y . x y x)`, macroTable))
  macroTable['OR'] = new MacroDef(toAst(`(λ x y . x x y)`, macroTable))
  macroTable['NOT'] = new MacroDef(toAst(`(λ p . p F T)`, macroTable))
  
  macroTable['T'] = new MacroDef(toAst(`(λ t f . t)`, macroTable)),
  macroTable['F'] = new MacroDef(toAst(`(λ t f . f)`, macroTable)),
  
  macroTable['+'] = new MacroDef(toAst(`(λ x y s z . x s (y s z))`, macroTable)),
  macroTable['-'] = new MacroDef(toAst(`(λ m n . (n PRED) m)`, macroTable))
  macroTable['*'] = new MacroDef(toAst(`(λ x y z . x (y z))`, macroTable)),
  macroTable['/'] = new MacroDef(toAst(`(λ n . Y (λ c n m f x . (λ d . ZERO d (0 f x) (f (c d m f x))) (- n m)) (SUC n))`, macroTable))
  macroTable['^'] = new MacroDef(toAst(`(λ x y . x y)`, macroTable))
  
  macroTable['DELTA'] = new MacroDef(toAst(`(λ m n . + (- m n) (- n m))`, macroTable))
  
  macroTable['='] = new MacroDef(toAst(`(λ m n . ZERO (DELTA m n))`, macroTable))
  macroTable['>'] = new MacroDef(toAst(`(λ m n . NOT (ZERO (- m n)))`, macroTable))
  macroTable['<'] = new MacroDef(toAst(`(λ m n . > n m )`, macroTable))
  macroTable['>='] = new MacroDef(toAst(`(λ m n . ZERO (- n m))`, macroTable))
  macroTable['<='] = new MacroDef(toAst(`(λ m n . ZERO (- m n))`, macroTable))

  // QUICK MACROS - non recursively defined
  // macroTable['NOT'] = new MacroDef(toAst(`(λ p . p (λ t f . f) (λ t f . t))`, macroTable))
  // macroTable['-'] = new MacroDef(toAst(`(λ m n . (n (λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))) m)`, macroTable))
  // macroTable['/'] = new MacroDef(toAst(`(λ n . (λ f . (λ x . f (x x)) (λ x . f (x x))) (λ c n m f x . (λ d . (λ n . n (λ x . (λ t f . f)) (λ t f . t)) d (0 f x) (f (c d m f x))) ((λ m n . (n (λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))) m) n m)) ((λ n s z . s (n s z)) n))`, macroTable))
  // macroTable['DELTA'] = new MacroDef(toAst(`(λ m n . (λ x y s z . x s (y s z)) ((λ m n . (n (λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))) m) m n) ((λ m n . (n (λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))) m) n m))`, macroTable))
  // macroTable['='] = new MacroDef(toAst(`(λ m n . (λ n . n (λ x . (λ t f . f)) (λ t f . t)) ((λ m n . (λ x y s z . x s (y s z)) ((λ m n . (n (λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))) m) m n) ((λ m n . (n (λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))) m) n m)) m n))`, macroTable))
  // macroTable['>'] = new MacroDef(toAst(`(λ m n . (λ p . p (λ t f . f) (λ t f . t)) ((λ n . n (λ x . (λ t f . f)) (λ t f . t)) ((λ m n . (n (λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))) m) m n)))`, macroTable))
  // macroTable['<'] = new MacroDef(toAst(`(λ m n . (λ m n . (λ p . p (λ t f . f) (λ t f . t)) ((λ n . n (λ x . (λ t f . f)) (λ t f . t)) ((λ m n . (n (λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))) m) m n))) n m )`, macroTable))
  // macroTable['>='] = new MacroDef(toAst(`(λ m n . (λ n . n (λ x . (λ t f . f)) (λ t f . t)) (- n m))`, macroTable))  
  // macroTable['<='] = new MacroDef(toAst(`(λ m n . (λ n . n (λ x . (λ t f . f)) (λ t f . t)) ((λ m n . (n (λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))) m) m n))`, macroTable))

  const parser : Parser = new Parser(tokens, macroTable)

  return parser.parse(null)
}

export default {
  parse,
  Lambda,
  Variable,
  Macro,
  Application,
}