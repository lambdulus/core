import { GamaArg, arity } from "../reductions"
import { ChurchNumeral, AST } from "../ast"
import { parse } from "../parser"
import { tokenize, TokenType, Token, BLANK_POSITION } from "../lexer"

export class Abstractions {
  private static knownAbstractions : { [ name : string ] : [ arity, (args : Array<GamaArg>) => boolean, (args : Array<GamaArg>) => AST ] } = {
    'ZERO' : [
      1,
      (args : Array<GamaArg>) => {
        const [ first ] = args

        return args.length === 1 && first instanceof ChurchNumeral
      },
      (args : Array<GamaArg>) => {
        const [ first ] = args

        const value : boolean = 0 === Number((<ChurchNumeral>first).name())
        const lambdaValue = value ? 'T' : 'F'

        return parse(tokenize(lambdaValue, { lambdaLetters : [ '\\' ], singleLetterVars : false }), {})
      }
    ],
    // 'PRED' : [ 1, () => true, () => {} ],
    // 'SUC' : [ 1, () => true, () => {} ],
    // 'AND' : [ 2, () => true, () => {} ],
    // 'OR' : [ 2, () => true, () => {} ],
    // 'NOT' : [ 1, () => true, () => {} ],
    '+' : [
      2,
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
    '-' : [
      2,
      (args : Array<GamaArg>) => {
      const [ first, second ] = args
      return args.length === 2 && first instanceof ChurchNumeral && second instanceof ChurchNumeral
    },
    (args : Array<GamaArg>) => {
      const [ first, second ] = args

      const value : number = Number((<ChurchNumeral>first).name()) - Number((<ChurchNumeral>second).name())
      const dummyToken : Token = new Token(TokenType.Number, `${value}`, BLANK_POSITION)
      return new ChurchNumeral(dummyToken)
    } ],
    '*' : [
      2,
      (args : Array<GamaArg>) => {
      const [ first, second ] = args
      return args.length === 2 && first instanceof ChurchNumeral && second instanceof ChurchNumeral
      },
      (args : Array<GamaArg>) => {
      const [ first, second ] = args

      const value : number = Number((<ChurchNumeral>first).name()) * Number((<ChurchNumeral>second).name())
      const dummyToken : Token = new Token(TokenType.Number, `${value}`, BLANK_POSITION)
      return new ChurchNumeral(dummyToken)
    } ],
    '/' : [
      2,
      (args : Array<GamaArg>) => {
      const [ first, second ] = args
      return args.length === 2 && first instanceof ChurchNumeral && second instanceof ChurchNumeral
      },
      (args : Array<GamaArg>) => {
      const [ first, second ] = args

      const value : number = Number((<ChurchNumeral>first).name()) / Number((<ChurchNumeral>second).name())
      const dummyToken : Token = new Token(TokenType.Number, `${value}`, BLANK_POSITION)
      return new ChurchNumeral(dummyToken)
    } ],
    '^' : [
      2,
      (args : Array<GamaArg>) => {
        const [ first, second ] = args
        return args.length === 2 && first instanceof ChurchNumeral && second instanceof ChurchNumeral
      },
      (args : Array<GamaArg>) => {
        const [ first, second ] = args

        const value : number = Number((<ChurchNumeral>first).name()) ^ Number((<ChurchNumeral>second).name())
        const dummyToken : Token = new Token(TokenType.Number, `${value}`, BLANK_POSITION)
        return new ChurchNumeral(dummyToken)
    } ],
    'DELTA' : [
      2,
      (args : Array<GamaArg>) => {
      const [ first, second ] = args
      return args.length === 2 && first instanceof ChurchNumeral && second instanceof ChurchNumeral
    }, (args : Array<GamaArg>) => {
      const [ first, second ] = args

      const value : number = Math.abs( Number((<ChurchNumeral>first).name()) - Number((<ChurchNumeral>second).name()) )
      const dummyToken : Token = new Token(TokenType.Number, `${value}`, BLANK_POSITION)
      return new ChurchNumeral(dummyToken)
    } ],
    '=' : [
      2,
      (args : Array<GamaArg>) => {
      const [ first, second ] = args
      return args.length === 2 && first instanceof ChurchNumeral && second instanceof ChurchNumeral
    }, (args : Array<GamaArg>) => {
      const [ first, second ] = args

      const value : boolean = Number((<ChurchNumeral>first).name()) === Number((<ChurchNumeral>second).name())
      const lambdaValue = value ? 'T' : 'F'

      return parse(tokenize(lambdaValue, { lambdaLetters : [ '\\' ], singleLetterVars : false }), {})
    } ],
    '>' : [
      2,
      (args : Array<GamaArg>) => {
      const [ first, second ] = args
      return args.length === 2 && first instanceof ChurchNumeral && second instanceof ChurchNumeral
    }, (args : Array<GamaArg>) => {
      const [ first, second ] = args

      const value : boolean = Number((<ChurchNumeral>first).name()) > Number((<ChurchNumeral>second).name())
      const lambdaValue = value ? 'T' : 'F'

      return parse(tokenize(lambdaValue, { lambdaLetters : [ '\\' ], singleLetterVars : false }), {})
    } ],
    '<' : [
      2,
      (args : Array<GamaArg>) => {
      const [ first, second ] = args
      return args.length === 2 && first instanceof ChurchNumeral && second instanceof ChurchNumeral
    }, (args : Array<GamaArg>) => {
      const [ first, second ] = args

      const value : boolean = Number((<ChurchNumeral>first).name()) < Number((<ChurchNumeral>second).name())
      const lambdaValue = value ? 'T' : 'F'

      return parse(tokenize(lambdaValue, { lambdaLetters : [ '\\' ], singleLetterVars : false }), {})
    } ],
    '>=' : [
      2,
      (args : Array<GamaArg>) => {
      const [ first, second ] = args
      return args.length === 2 && first instanceof ChurchNumeral && second instanceof ChurchNumeral
    }, (args : Array<GamaArg>) => {
      const [ first, second ] = args

      const value : boolean = Number((<ChurchNumeral>first).name()) >= Number((<ChurchNumeral>second).name())
      const lambdaValue = value ? 'T' : 'F'

      return parse(tokenize(lambdaValue, { lambdaLetters : [ '\\' ], singleLetterVars : false }), {})
    } ],
    '<=' : [
      2,
      (args : Array<GamaArg>) => {
      const [ first, second ] = args
      return args.length === 2 && first instanceof ChurchNumeral && second instanceof ChurchNumeral
    }, (args : Array<GamaArg>) => {
      const [ first, second ] = args

      const value : boolean = Number((<ChurchNumeral>first).name()) <= Number((<ChurchNumeral>second).name())
      const lambdaValue = value ? 'T' : 'F'

      return parse(tokenize(lambdaValue, { lambdaLetters : [ '\\' ], singleLetterVars : false }), {})
    } ],
  }

  public static has (name : string) : boolean {
    return name in this.knownAbstractions
  }

  public static getArity (name : string) : number {
    const [ arity ] = this.knownAbstractions[name]

    return arity
  }

  public static assert (name : string, args : Array<GamaArg>) : boolean {
    const [ _, assert ] = this.knownAbstractions[name]

    return assert(args)
  }

  public static evaluate (name : string, args : Array<GamaArg>) : AST {
    const [ _, __, evaluation ] = this.knownAbstractions[name]

    return evaluation(args)
  }
}