import { arity } from "../reductions"
import { ChurchNumeral, AST, Macro, Lambda, Application, Variable } from "../ast"
import { parse } from "../parser"
import { tokenize, TokenType, Token, BLANK_POSITION } from "../lexer"
import { Parser } from "../parser/parser";

export type AlowedTypes = Array<any> 
export type ArgumentConstraints = Array<AlowedTypes>

export class Abstractions {
  private static knownAbstractions : { [ name : string ] : [ arity, ArgumentConstraints , (args : Array<AST>) => boolean, (args : Array<AST>) => AST ] } = {
    // TODO: consider implementing Y combinator
    'Y' : [
      1,
      [ [ Lambda, Macro ] ],
      (args : Array<AST>) => {
        const [ first ] = args

        return args.length === 1 && (first instanceof Lambda || first instanceof Macro)
      },
      (args : Array<AST>) => {
        const [ first ] = args
        let macroTable = {}

        if (first instanceof Macro) {
          macroTable = first.macroTable
        }

        const lambdaValue : string = `${first.toString()} (Y ${first.toString()})`

        const parser : Parser = new Parser(tokenize(lambdaValue, { lambdaLetters : [ '\\', 'λ', ], singleLetterVars : false, macromap : {} }), macroTable)

        return parser.parse(null)
      }
    ],
    'ZERO' : [
      1,
      [ [ ChurchNumeral ] ],
      (args : Array<AST>) => {
        const [ first ] = args

        return args.length === 1 && first instanceof ChurchNumeral
      },
      (args : Array<AST>) => {
        const [ first ] = args

        const value : boolean = 0 === Number((<ChurchNumeral>first).name())
        const lambdaValue : string = value ? 'T' : 'F'

        return parse(tokenize(lambdaValue, { lambdaLetters : [ '\\', 'λ', ], singleLetterVars : false, macromap : {} }), {})
      }
    ],
    'PRED' : [
      1,
      [ [ ChurchNumeral ] ],
      (args : Array<AST>) => {
        const [ first ] = args

        return args.length === 1 && first instanceof ChurchNumeral
      },
      (args : Array<AST>) => {
        const [ first ] = args

        const value : number = Math.max(0, Number(first) - 1)
        const lambdaValue : string = `${value}`

        return parse(tokenize(lambdaValue, { lambdaLetters : [ '\\', 'λ', ], singleLetterVars : false, macromap : {} }), {})
      }
    ],
    'SUC' : [
      1,
      [ [ ChurchNumeral ] ],
      (args : Array<AST>) => {
        const [ first ] = args

        return args.length === 1 && first instanceof ChurchNumeral
      },
      (args : Array<AST>) => {
        const [ first ] = args

        const value : number = Number(first) + 1
        const lambdaValue : string = `${value}`

        return parse(tokenize(lambdaValue, { lambdaLetters : [ '\\', 'λ', ], singleLetterVars : false, macromap : {} }), {})
      }
    ],
    'AND' : [
      2,
      [ [ Macro ], [ Macro ] ],
      (args : Array<AST>) => {
        const [ first, second ] = args
        return args.length === 2 && first instanceof Macro && second instanceof Macro && (first.name() === 'T' || first.name() === 'F') && (second.name() === 'T' || second.name() === 'F')
      },
      (args : Array<AST>) => {
        const [ first, second ] = args


        const firstBoolean : boolean = (<Macro>first).name() === 'T' ? true : false
        const secondBoolean : boolean = (<Macro>second).name() === 'T' ? true : false

        const value : boolean = firstBoolean && secondBoolean
        const lambdaValue : string = value ? 'T' : 'F'

        return parse(tokenize(lambdaValue, { lambdaLetters : [ '\\', 'λ', ], singleLetterVars : false, macromap : {} }), {})
      }
    ],
    'OR' : [
      2,
      [ [ Macro ], [ Macro ] ],
      (args : Array<AST>) => {
        const [ first, second ] = args
        return args.length === 2 && first instanceof Macro && second instanceof Macro && (first.name() === 'T' || first.name() === 'F') && (second.name() === 'T' || second.name() === 'F')
      },
      (args : Array<AST>) => {
        const [ first, second ] = args


        const firstBoolean : boolean = (<Macro>first).name() === 'T' ? true : false
        const secondBoolean : boolean = (<Macro>second).name() === 'T' ? true : false

        const value : boolean = firstBoolean || secondBoolean
        const lambdaValue : string = value ? 'T' : 'F'

        return parse(tokenize(lambdaValue, { lambdaLetters : [ '\\', 'λ', ], singleLetterVars : false, macromap : {} }), {})
      }
    ],
    'NOT' : [
      1,
      [ [ Macro ] ],
      (args : Array<AST>) => {
        const [ first ] = args

        return args.length === 1 && first instanceof Macro && (first.name() === 'F' || first.name() === 'T')
      },
      (args : Array<AST>) => {
        const [ first ] = args

        const name : string = (<Macro>first).name()
        const value : boolean = name === 'T' ? true : false
        const negative : boolean = ! value
        const lambdaValue : string = negative ? 'T' : 'F'
        // TODO: if I create Boolean offspring of Macro - this place is to get more simple

        return parse(tokenize(lambdaValue, { lambdaLetters : [ '\\', 'λ', ], singleLetterVars : false, macromap : {} }), {})
      }
    ],
    'T' : [
      2,
      [ [ Lambda, Application, Variable, ChurchNumeral, Macro ], [ Lambda, Application, Variable, ChurchNumeral, Macro ] ],
      (args : Array<AST>) => {
        return args.length === 2
      },
      (args : Array<AST>) => {
      const [ first ] = args

      return first
    } ],
    'F' : [
      2,
      [ [ Lambda, Application, Variable, ChurchNumeral, Macro ], [ Lambda, Application, Variable, ChurchNumeral, Macro ] ],
      (args : Array<AST>) => {
        return args.length === 2
      },
      (args : Array<AST>) => {
      const [ _, second ] = args

      return second
    } ],
    '+' : [
      2,
      [ [ ChurchNumeral ], [ ChurchNumeral ] ],
      (args : Array<AST>) => {
        const [ first, second ] = args
        return args.length === 2 && first instanceof ChurchNumeral && second instanceof ChurchNumeral
      },
      (args : Array<AST>) => {
      const [ first, second ] = args

      const value : number = Number((<ChurchNumeral>first).name()) + Number((<ChurchNumeral>second).name())
      const dummyToken : Token = new Token(TokenType.Number, `${value}`, BLANK_POSITION)
      return new ChurchNumeral(dummyToken)
    } ],
    '-' : [
      2,
      [ [ ChurchNumeral ], [ ChurchNumeral ] ],
      (args : Array<AST>) => {
      const [ first, second ] = args
      return args.length === 2 && first instanceof ChurchNumeral && second instanceof ChurchNumeral
    },
    (args : Array<AST>) => {
      const [ first, second ] = args

      const value : number = Number((<ChurchNumeral>first).name()) - Number((<ChurchNumeral>second).name())
      const dummyToken : Token = new Token(TokenType.Number, `${value}`, BLANK_POSITION)
      return new ChurchNumeral(dummyToken)
    } ],
    '*' : [
      2,
      [ [ ChurchNumeral ], [ ChurchNumeral ] ],
      (args : Array<AST>) => {
      const [ first, second ] = args
      return args.length === 2 && first instanceof ChurchNumeral && second instanceof ChurchNumeral
      },
      (args : Array<AST>) => {
      const [ first, second ] = args

      const value : number = Number((<ChurchNumeral>first).name()) * Number((<ChurchNumeral>second).name())
      const dummyToken : Token = new Token(TokenType.Number, `${value}`, BLANK_POSITION)
      return new ChurchNumeral(dummyToken)
    } ],
    '/' : [
      2,
      [ [ ChurchNumeral ], [ ChurchNumeral ] ],
      (args : Array<AST>) => {
      const [ first, second ] = args
      return args.length === 2 && first instanceof ChurchNumeral && second instanceof ChurchNumeral
      },
      (args : Array<AST>) => {
      const [ first, second ] = args

      const value : number = Number((<ChurchNumeral>first).name()) / Number((<ChurchNumeral>second).name())
      const dummyToken : Token = new Token(TokenType.Number, `${value}`, BLANK_POSITION)
      return new ChurchNumeral(dummyToken)
    } ],
    '^' : [
      2,
      [ [ ChurchNumeral ], [ ChurchNumeral ] ],
      (args : Array<AST>) => {
        const [ first, second ] = args
        return args.length === 2 && first instanceof ChurchNumeral && second instanceof ChurchNumeral
      },
      (args : Array<AST>) => {
        const [ first, second ] = args

        const value : number = Number((<ChurchNumeral>first).name()) ^ Number((<ChurchNumeral>second).name())
        const dummyToken : Token = new Token(TokenType.Number, `${value}`, BLANK_POSITION)
        return new ChurchNumeral(dummyToken)
    } ],
    'DELTA' : [
      2,
      [ [ ChurchNumeral ], [ ChurchNumeral ] ],
      (args : Array<AST>) => {
      const [ first, second ] = args
      return args.length === 2 && first instanceof ChurchNumeral && second instanceof ChurchNumeral
    }, (args : Array<AST>) => {
      const [ first, second ] = args

      const value : number = Math.abs( Number((<ChurchNumeral>first).name()) - Number((<ChurchNumeral>second).name()) )
      const dummyToken : Token = new Token(TokenType.Number, `${value}`, BLANK_POSITION)
      return new ChurchNumeral(dummyToken)
    } ],
    '=' : [
      2,
      [ [ ChurchNumeral ], [ ChurchNumeral ] ],
      (args : Array<AST>) => {
        const [ first, second ] = args

        return args.length === 2 && first instanceof ChurchNumeral && second instanceof ChurchNumeral
    }, (args : Array<AST>) => {
      const [ first, second ] = args

      const value : boolean = Number((<ChurchNumeral>first).name()) === Number((<ChurchNumeral>second).name())
      const lambdaValue = value ? 'T' : 'F'

      return parse(tokenize(lambdaValue, { lambdaLetters : [ '\\', 'λ', ], singleLetterVars : false, macromap : {} }), {})
    } ],
    '>' : [
      2,
      [ [ ChurchNumeral ], [ ChurchNumeral ] ],
      (args : Array<AST>) => {
      const [ first, second ] = args
      return args.length === 2 && first instanceof ChurchNumeral && second instanceof ChurchNumeral
    }, (args : Array<AST>) => {
      const [ first, second ] = args

      const value : boolean = Number((<ChurchNumeral>first).name()) > Number((<ChurchNumeral>second).name())
      const lambdaValue = value ? 'T' : 'F'

      return parse(tokenize(lambdaValue, { lambdaLetters : [ '\\', 'λ', ], singleLetterVars : false, macromap : {} }), {})
    } ],
    '<' : [
      2,
      [ [ ChurchNumeral ], [ ChurchNumeral ] ],
      (args : Array<AST>) => {
      const [ first, second ] = args
      return args.length === 2 && first instanceof ChurchNumeral && second instanceof ChurchNumeral
    }, (args : Array<AST>) => {
      const [ first, second ] = args

      const value : boolean = Number((<ChurchNumeral>first).name()) < Number((<ChurchNumeral>second).name())
      const lambdaValue = value ? 'T' : 'F'

      return parse(tokenize(lambdaValue, { lambdaLetters : [ '\\', 'λ', ], singleLetterVars : false, macromap : {} }), {})
    } ],
    '>=' : [
      2,
      [ [ ChurchNumeral ], [ ChurchNumeral ] ],
      (args : Array<AST>) => {
      const [ first, second ] = args
      return args.length === 2 && first instanceof ChurchNumeral && second instanceof ChurchNumeral
    }, (args : Array<AST>) => {
      const [ first, second ] = args

      const value : boolean = Number((<ChurchNumeral>first).name()) >= Number((<ChurchNumeral>second).name())
      const lambdaValue = value ? 'T' : 'F'

      return parse(tokenize(lambdaValue, { lambdaLetters : [ '\\', 'λ', ], singleLetterVars : false, macromap : {} }), {})
    } ],
    '<=' : [
      2,
      [ [ ChurchNumeral ], [ ChurchNumeral ] ],
      (args : Array<AST>) => {
      const [ first, second ] = args
      return args.length === 2 && first instanceof ChurchNumeral && second instanceof ChurchNumeral
    }, (args : Array<AST>) => {
      const [ first, second ] = args

      const value : boolean = Number((<ChurchNumeral>first).name()) <= Number((<ChurchNumeral>second).name())
      const lambdaValue = value ? 'T' : 'F'

      return parse(tokenize(lambdaValue, { lambdaLetters : [ '\\', 'λ', ], singleLetterVars : false, macromap : {} }), {})
    } ],
  }

  public static has (name : string) : boolean {
    return name in this.knownAbstractions
  }

  public static getArity (name : string) : number {
    const [ arity ] = this.knownAbstractions[name]

    return arity
  }

  public static assert (name : string, args : Array<AST>) : boolean {
    const [ _, __, assert ] = this.knownAbstractions[name]

    return assert(args)
  }

  public static evaluate (name : string, args : Array<AST>) : AST {
    const [ _, __, ___, evaluation ] = this.knownAbstractions[name]

    return evaluation(args)
  }

  public static inAllowedTypesFor (name : string, n : number, type : any) : boolean {
    const [ _, allowedTypesList ] = this.knownAbstractions[name]
    const allowedForN = allowedTypesList[n]

    return allowedForN.includes(type)
  }
}