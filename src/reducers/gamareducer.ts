import { AST, Binary, Child, Application, Lambda, ChurchNumeral, Macro, Variable } from "../ast"
import { ASTVisitor } from "../visitors"
import { Beta, arity, GamaArg, Gama } from "../reductions"
import { Token, TokenType, BLANK_POSITION, tokenize } from "../lexer";
import { MacroDef, parse } from "../parser";


export class GamaReducer extends ASTVisitor {
  private substituted : AST | null = null

  public readonly redexes : Array<Macro | Application> // TODO: consider redexes : List<Application>
  public readonly args : Array<GamaArg>
  public readonly parent : Binary | null
  public readonly treeSide : Child | null // na jaky strane pro parenta je redukovanej uzel
  public readonly abstraction : [ string, arity ]

  //                                               validator evaluator
  private static knownAbstraction : { [name : string] : [ Function, Function ] } = {
    'ZERO' : [ (args : Array<GamaArg>) => {
      const [ first ] = args
      return args.length === 1 && first instanceof ChurchNumeral
    },
    (args : Array<GamaArg>) => {
    const [ first ] = args

    const value : boolean = 0 === Number((<ChurchNumeral>first).name())
    const lambdaValue = value ? 'T' : 'F'

    return parse(tokenize(lambdaValue, { lambdaLetters : [ '\\' ], singleLetterVars : false }), {})
    } ],
    'PRED' : [ () => true, () => {} ],
    'SUC' : [ () => true, () => {} ],
    'AND' : [ () => true, () => {} ],
    'OR' : [ () => true, () => {} ],
    'NOT' : [ () => true, () => {} ],
    '+' : [
      (args : Array<GamaArg>) => {
        const [ first, second ] = args
        return args.length === 2 && first instanceof ChurchNumeral && second instanceof ChurchNumeral
      },
      (args : Array<GamaArg>) => {
      const [ first, second ] = args

      const value : number = Number((<ChurchNumeral>first).name()) + Number((<ChurchNumeral>second).name())
      const dummyToken : Token = new Token(TokenType.Number, `${value}`, BLANK_POSITION)
      return new ChurchNumeral(dummyToken)
    } ],
    '-' : [ (args : Array<GamaArg>) => {
      const [ first, second ] = args
      return args.length === 2 && first instanceof ChurchNumeral && second instanceof ChurchNumeral
    },
    (args : Array<GamaArg>) => {
      const [ first, second ] = args

      const value : number = Number((<ChurchNumeral>first).name()) - Number((<ChurchNumeral>second).name())
      const dummyToken : Token = new Token(TokenType.Number, `${value}`, BLANK_POSITION)
      return new ChurchNumeral(dummyToken)
    } ],
    '*' : [ (args : Array<GamaArg>) => {
      const [ first, second ] = args
      return args.length === 2 && first instanceof ChurchNumeral && second instanceof ChurchNumeral
    }, () => (args : Array<GamaArg>) => {
      const [ first, second ] = args

      const value : number = Number((<ChurchNumeral>first).name()) * Number((<ChurchNumeral>second).name())
      const dummyToken : Token = new Token(TokenType.Number, `${value}`, BLANK_POSITION)
      return new ChurchNumeral(dummyToken)
    } ],
    '/' : [ (args : Array<GamaArg>) => {
      const [ first, second ] = args
      return args.length === 2 && first instanceof ChurchNumeral && second instanceof ChurchNumeral
    }, (args : Array<GamaArg>) => {
      const [ first, second ] = args

      const value : number = Number((<ChurchNumeral>first).name()) / Number((<ChurchNumeral>second).name())
      const dummyToken : Token = new Token(TokenType.Number, `${value}`, BLANK_POSITION)
      return new ChurchNumeral(dummyToken)
    } ],
    '^' : [ (args : Array<GamaArg>) => {
      const [ first, second ] = args
      return args.length === 2 && first instanceof ChurchNumeral && second instanceof ChurchNumeral
    }, () => {} ],
    'DELTA' : [ (args : Array<GamaArg>) => {
      const [ first, second ] = args
      return args.length === 2 && first instanceof ChurchNumeral && second instanceof ChurchNumeral
    }, (args : Array<GamaArg>) => {
      const [ first, second ] = args

      const value : number = Math.abs( Number((<ChurchNumeral>first).name()) - Number((<ChurchNumeral>second).name()) )
      const dummyToken : Token = new Token(TokenType.Number, `${value}`, BLANK_POSITION)
      return new ChurchNumeral(dummyToken)
    } ],
    '=' : [ (args : Array<GamaArg>) => {
      const [ first, second ] = args
      return args.length === 2 && first instanceof ChurchNumeral && second instanceof ChurchNumeral
    }, (args : Array<GamaArg>) => {
      const [ first, second ] = args

      const value : boolean = Number((<ChurchNumeral>first).name()) === Number((<ChurchNumeral>second).name())
      const lambdaValue = value ? 'T' : 'F'

      return parse(tokenize(lambdaValue, { lambdaLetters : [ '\\' ], singleLetterVars : false }), {})
    } ],
    '>' : [ (args : Array<GamaArg>) => {
      const [ first, second ] = args
      return args.length === 2 && first instanceof ChurchNumeral && second instanceof ChurchNumeral
    }, (args : Array<GamaArg>) => {
      const [ first, second ] = args

      const value : boolean = Number((<ChurchNumeral>first).name()) > Number((<ChurchNumeral>second).name())
      const lambdaValue = value ? 'T' : 'F'

      return parse(tokenize(lambdaValue, { lambdaLetters : [ '\\' ], singleLetterVars : false }), {})
    } ],
    '<' : [ (args : Array<GamaArg>) => {
      const [ first, second ] = args
      return args.length === 2 && first instanceof ChurchNumeral && second instanceof ChurchNumeral
    }, (args : Array<GamaArg>) => {
      const [ first, second ] = args

      const value : boolean = Number((<ChurchNumeral>first).name()) < Number((<ChurchNumeral>second).name())
      const lambdaValue = value ? 'T' : 'F'

      return parse(tokenize(lambdaValue, { lambdaLetters : [ '\\' ], singleLetterVars : false }), {})
    } ],
    '>=' : [ (args : Array<GamaArg>) => {
      const [ first, second ] = args
      return args.length === 2 && first instanceof ChurchNumeral && second instanceof ChurchNumeral
    }, (args : Array<GamaArg>) => {
      const [ first, second ] = args

      const value : boolean = Number((<ChurchNumeral>first).name()) >= Number((<ChurchNumeral>second).name())
      const lambdaValue = value ? 'T' : 'F'

      return parse(tokenize(lambdaValue, { lambdaLetters : [ '\\' ], singleLetterVars : false }), {})
    } ],
    '<=' : [ (args : Array<GamaArg>) => {
      const [ first, second ] = args
      return args.length === 2 && first instanceof ChurchNumeral && second instanceof ChurchNumeral
    }, (args : Array<GamaArg>) => {
      const [ first, second ] = args

      const value : boolean = Number((<ChurchNumeral>first).name()) <= Number((<ChurchNumeral>second).name())
      const lambdaValue = value ? 'T' : 'F'

      return parse(tokenize(lambdaValue, { lambdaLetters : [ '\\' ], singleLetterVars : false }), {})
    } ],
  }
  
  constructor (
    { redexes, args, parent, treeSide, abstraction } : Gama,
    public tree : AST,
  ) {
    super()
    this.redexes = redexes
    this.args = args
    this.parent = parent
    this.treeSide = treeSide
    this.abstraction = abstraction

    this.tree = tree
  }

  perform () : void {
    const [ name ] = this.abstraction
    const target : Application = <Application>this.redexes[this.redexes.length - 1] // last node, must by APP
    const [ _, evaluation ] = GamaReducer.knownAbstraction[name] 

    this.substituted = evaluation(this.args)

    if (this.parent === null) {
      this.tree = <AST> this.substituted
    }
    else {
      this.parent[<Child> this.treeSide] = <AST> this.substituted
    }
  }

  static assertReduction ({ redexes, args, parent, treeSide, abstraction } : Gama) : boolean {
    const [ name ] = abstraction
    if ( ! (name in this.knownAbstraction)) {
      return false
    }

    const [ assertion ] = this.knownAbstraction[name] 

    return assertion(args)
  }
}