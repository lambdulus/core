import Lexer, { Token, TokenType, CodeStyle } from '../lexer'
import { Lambda } from './ast/lambda'
import { Variable } from './ast/variable'
import { Macro } from './ast/macro'
import { ChurchNumber } from './ast/churchnumber'
import { Application } from './ast/application'
import { Visitor } from '../visitors/visitor'

// TODO: tak tohle zrusime nahradime logikou visitor patternu
export interface Binary extends AST {
  left : AST,
  right : AST,
}

export interface Visitable {
  visit(visitor : Visitor) : void,
}

// TODO: refactor out features
// everything will be replaced by visitor 
export interface AST extends Visitable {
  identifier : symbol,
  clone () : AST,
  nextNormal (parent : Binary | null, child : Child | null) : NextReduction, // TODO: DELETE
  reduceNormal () : ReductionResult, // TODO: DELETE
  reduceApplicative () : ReductionResult, // TODO: DELETE
  print () : string, // TODO: DELETE
  alphaConvert (oldName : string, newName : string) : AST,
  betaReduce (argName : string, value : AST) : AST,
  etaConvert () : AST,
  freeVarName (bound : Array<string>) : string | null,
}

// zvazit jestli je tohle vubec potreba
// expand je pouzitej jenom uvnitr takze by mohl byt private a pak neni vubec nepotreba Interface
// ve skutecnosti expand volam zvenku takze OK nechat
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
  Alpha, // = 0
  Beta, // = 1
  Expansion, // = 2
  None, // = 3
}

// TODO: obsolete --->>> delete
export type ReductionResult = {
  tree : AST,
  reduced : boolean,
  reduction : Reduction,
  currentSubtree : AST,
}

export enum Child {
  Left = 'left',
  Right = 'right',
}


// TODO: interface Binary, kde bude kazdej uzel muset mit left a right
// budou to vlastne jenom alias getter a setter pro ucely univerzalniho zachazeni s parentnim uzlem
// diky tomu nebudu muset zkoumat co je parent zac jestli lambda a jeho right je argument
// nebo application a ma left a right
// takze v zasade jde jenom o to, zaridit aby lambda mela taky left a right i guess

// TODO: tohle nahradi konkretni druh Visitoru neco jako NormalReductionFinder/NormReductionFinder
// dalsi pripad bude AppReductionFinder
// dalsi bude TreePrinter
// a tu spodni informaci bude v sobe drzet konkretni Visitor
export type NextReduction = NextAlpha | NextBeta | NextExpansion | NextNone

export class NextAlpha {
  constructor (
    public readonly tree : Application,
    public readonly child : Child,
    public readonly oldName : string,
    public readonly newName : string,
    // TODO:
    // taky mnozinu referenci na vyskyty promennych tam, kde se budou nahrazovat
    // at to nemusi implementace hledat, proste doslova jenom prohazi ??? -> zvazit
  ) {}
}

export class NextBeta {
  constructor (
    public readonly parent : Binary | null,
    public readonly treeSide : Child | null, // na jaky strane pro parenta je redukovanej uzel
    public readonly target : AST, // EXPR ve kterem se provede nahrada
    public readonly argName : string,
    public readonly value : AST,
  ) {}
}

// TODO: vyresit pro pripady kdy jde o multilambdu
// pak bude navic drzet mnozinu values a mnozinu arguments
// spis mnozinu tuples

export class NextExpansion {
  constructor (
    public readonly parent : Binary | null,
    public readonly treeSide : Child | null,
    public readonly tree : Expandable,
  ) {}
}

export class NextNone {}


class Parser {
  private position : number = 0

  // TODO: refactor
  // maybe put it outside of Parser class inside the Parser module
  public static toAst (definition : string, macroTable : MacroTable) : AST {
    const codeStyle : CodeStyle = { singleLetterVars : true, lambdaLetters : [ 'λ' ] }
    const parser : Parser = new Parser(Lexer.tokenize(definition, codeStyle), macroTable)
    
    return parser.parse(null)
  }

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

export function parse (tokens : Array<Token>) : AST {
  // TODO: refactor macroTable for usage with user defined macro definitions

  const macroTable : MacroTable = {}

  macroTable['Y'] = new MacroDef(Parser.toAst(`(λ f . (λ x . f (x x)) (λ x . f (x x)))`, macroTable)),

  macroTable['ZERO'] = new MacroDef(Parser.toAst(`(λ n . n (λ x . (λ t f . f)) (λ t f . t))`, macroTable)),
  
  macroTable['PRED'] = new MacroDef(Parser.toAst(`(λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))`, macroTable))
  macroTable['SUC'] = new MacroDef(Parser.toAst(`(λ n s z . s (n s z))`, macroTable))
    
  macroTable['AND'] = new MacroDef(Parser.toAst(`(λ x y . x y x)`, macroTable))
  macroTable['OR'] = new MacroDef(Parser.toAst(`(λ x y . x x y)`, macroTable))
  macroTable['NOT'] = new MacroDef(Parser.toAst(`(λ p . p F T)`, macroTable))
  
  macroTable['T'] = new MacroDef(Parser.toAst(`(λ t f . t)`, macroTable)),
  macroTable['F'] = new MacroDef(Parser.toAst(`(λ t f . f)`, macroTable)),
  
  macroTable['+'] = new MacroDef(Parser.toAst(`(λ x y s z . x s (y s z))`, macroTable)),
  macroTable['-'] = new MacroDef(Parser.toAst(`(λ m n . (n PRED) m)`, macroTable))
  macroTable['*'] = new MacroDef(Parser.toAst(`(λ x y z . x (y z))`, macroTable)),
  macroTable['/'] = new MacroDef(Parser.toAst(`(λ n . Y (λ c n m f x . (λ d . ZERO d (0 f x) (f (c d m f x))) (- n m)) (SUC n))`, macroTable))
  macroTable['^'] = new MacroDef(Parser.toAst(`(λ x y . x y)`, macroTable))
  
  macroTable['DELTA'] = new MacroDef(Parser.toAst(`(λ m n . + (- m n) (- n m))`, macroTable))
  
  macroTable['='] = new MacroDef(Parser.toAst(`(λ m n . ZERO (DELTA m n))`, macroTable))
  macroTable['>'] = new MacroDef(Parser.toAst(`(λ m n . NOT (ZERO (- m n)))`, macroTable))
  macroTable['<'] = new MacroDef(Parser.toAst(`(λ m n . > n m )`, macroTable))
  macroTable['>='] = new MacroDef(Parser.toAst(`(λ m n . ZERO (- n m))`, macroTable))
  macroTable['<='] = new MacroDef(Parser.toAst(`(λ m n . ZERO (- m n))`, macroTable))

  // QUICK MACROS - non recursively defined
  // macroTable['NOT'] = new MacroDef(Parser.toAst(`(λ p . p (λ t f . f) (λ t f . t))`, macroTable))
  // macroTable['-'] = new MacroDef(Parser.toAst(`(λ m n . (n (λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))) m)`, macroTable))
  // macroTable['/'] = new MacroDef(Parser.toAst(`(λ n . (λ f . (λ x . f (x x)) (λ x . f (x x))) (λ c n m f x . (λ d . (λ n . n (λ x . (λ t f . f)) (λ t f . t)) d (0 f x) (f (c d m f x))) ((λ m n . (n (λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))) m) n m)) ((λ n s z . s (n s z)) n))`, macroTable))
  // macroTable['DELTA'] = new MacroDef(Parser.toAst(`(λ m n . (λ x y s z . x s (y s z)) ((λ m n . (n (λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))) m) m n) ((λ m n . (n (λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))) m) n m))`, macroTable))
  // macroTable['='] = new MacroDef(Parser.toAst(`(λ m n . (λ n . n (λ x . (λ t f . f)) (λ t f . t)) ((λ m n . (λ x y s z . x s (y s z)) ((λ m n . (n (λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))) m) m n) ((λ m n . (n (λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))) m) n m)) m n))`, macroTable))
  // macroTable['>'] = new MacroDef(Parser.toAst(`(λ m n . (λ p . p (λ t f . f) (λ t f . t)) ((λ n . n (λ x . (λ t f . f)) (λ t f . t)) ((λ m n . (n (λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))) m) m n)))`, macroTable))
  // macroTable['<'] = new MacroDef(Parser.toAst(`(λ m n . (λ m n . (λ p . p (λ t f . f) (λ t f . t)) ((λ n . n (λ x . (λ t f . f)) (λ t f . t)) ((λ m n . (n (λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))) m) m n))) n m )`, macroTable))
  // macroTable['>='] = new MacroDef(Parser.toAst(`(λ m n . (λ n . n (λ x . (λ t f . f)) (λ t f . t)) (- n m))`, macroTable))  
  // macroTable['<='] = new MacroDef(Parser.toAst(`(λ m n . (λ n . n (λ x . (λ t f . f)) (λ t f . t)) ((λ m n . (n (λ x s z . x (λ f g . g (f s)) (λ g . z) (λ u . u))) m) m n))`, macroTable))

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