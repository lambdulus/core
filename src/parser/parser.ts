import Lexer, { Token, TokenType, CodeStyle } from '../lexer'
import { Lambda } from './ast/lambda'
import { Variable } from './ast/variable'
import { Macro } from './ast/macro'
import { ChurchNumber } from './ast/churchnumber'
import { Application } from './ast/application'


export interface AST {
  clone () : AST,
  reduceNormal () : ReductionResult,
  reduceApplicative () : ReductionResult,
  print () : string,
  alphaConvert (oldName : string, newName : string) : AST,
  betaReduce (argName : string, value : AST) : AST,
  etaConvert () : AST,
  freeVarName (bound : Array<string>) : string | null,
}

// zvazit jestli je tohle vubec potreba
// expand je pouzitej jenom uvnitr takze by mohl byt private a pak neni vubec nepotreba Interface
export interface Expandable {
  expand () : AST,
}

export class MacroDef {
  constructor (
    public readonly ast : AST,
  ) {}
}

interface MacroTable {
  [ name : string ] : MacroDef
}

export enum Reduction {
  alpha, // = 0
  beta, // = 1
  expansion, // = 2
  none, // = 3
  // partialBeta, // = 4 // jelikoz veskery macro operace prelozim expanzi na pure λ nebudu delat partial
}

export type ReductionResult = {
  tree : AST,
  reduced : boolean,
  reduction : Reduction,
  currentSubtree : AST,
}


class Parser {
  private position : number = 0

  // TODO: refactor, because this looks terrible
  public static toAst (definition : string) : AST {
    const codeStyle : CodeStyle = { singleLetterVars : true, lambdaLetters : [ 'λ' ] }
    const parser : Parser = new Parser(Lexer.tokenize(definition, codeStyle), {})
    
    return parser.parse(null)
  } 

  // pokud budu chtit pridavat uzivatelska makra asi bude lepsi to udelat v constructoru
  // private static macroTable : MacroTable = {
  //   'Y' : new MacroDef(Parser.toAst(`(λ f . (λ x . f (x x)) (λ x . f (x x)))`)),
  //   // 'T' : new MacroDef(Parser.toAst(`(λ t f . t)`)),
  //   // 'F' : new MacroDef(Parser.toAst(`(λ t f . f)`)),
  //   // + - / * Zero Pred ...
  // }

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

        // todo: I don't like this much, possible more elegant way?
        // if (top.value in Parser.macroTable) {
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
  parse (leftSide : AST, ) : AST {
    if (this.exprEnd()) {
      return leftSide
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

export function parse (tokens : Array<Token>) : AST {
  // TODO: refactor some global stuff
  const macroTable : MacroTable = {
    'Y' : new MacroDef(Parser.toAst(`(λ f . (λ x . f (x x)) (λ x . f (x x)))`)),
    'T' : new MacroDef(Parser.toAst(`(λ t f . t)`)),
    'F' : new MacroDef(Parser.toAst(`(λ t f . f)`)),
    '+' : new MacroDef(Parser.toAst(`(λ x y s z . x s (y s z))`)),
    '-' : new MacroDef(Parser.toAst(`(λ m n . (n (λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))) m)`)),
    '*' : new MacroDef(Parser.toAst(`(λ x y z . x (y z))`)),
    '/' : new MacroDef(Parser.toAst(`(λ n . (λ f . (λ x . f (x x)) (λ x . f (x x))) (λ c n m f x . (λ d . (λ n . n (λ x . (λ t f . f)) (λ t f . t)) d (0 f x) (f (c d m f x))) ((λ m n . (n (λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))) m) n m)) ((λ n s z . s (n s z)) n))`)),
    'ZERO' : new MacroDef(Parser.toAst(`(λ n . n (λ x . (λ t f . f)) (λ t f . t))`)),
    'NOT' : new MacroDef(Parser.toAst(`(λ p . p (λ t f . f) (λ t f . t))`)),
    '>' : new MacroDef(Parser.toAst(`(λ m n . (λ p . p (λ t f . f) (λ t f . t)) ((λ n . n (λ x . (λ t f . f)) (λ t f . t)) ((λ m n . (n (λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))) m) m n)))`)),
    '<' : new MacroDef(Parser.toAst(`(λ m n . (λ m n . (λ p . p (λ t f . f) (λ t f . t)) ((λ n . n (λ x . (λ t f . f)) (λ t f . t)) ((λ m n . (n (λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))) m) m n))) n m )`)),
    '<=' : new MacroDef(Parser.toAst(`(λ m n . (λ n . n (λ x . (λ t f . f)) (λ t f . t)) ((λ m n . (n (λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))) m) m n))`)),


    // + - / * Zero Pred ...
  }
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