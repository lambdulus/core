import Lexer, { Token, CodeStyle } from '../../lexer'
import {
  AST,
  Binary,
  ReductionResult,
  Reduction,
  Expandable,
  parse,
  NextReduction,
  NextExpansion,
  Child,
} from '../parser'
import { Visitor } from '../../visitors/visitor';

export class ChurchNumber implements AST, Expandable {
  public readonly identifier : symbol = Symbol()

  name () : string {
    return `${ this.token.value }`
  }

  constructor (
    public readonly token : Token,
  ) {}
  
  clone () : ChurchNumber {
    return new ChurchNumber(this.token)
  }

  visit (visitor : Visitor) : void {
    visitor.onChurchNumber(this)
  }

  nextNormal (parent : Binary | null, child : Child | null) : NextReduction {
    return new NextExpansion(parent, child, this)
  }
  
  reduceNormal () : ReductionResult {
    return { tree : this.expand(), reduced : true, reduction : Reduction.Expansion, currentSubtree : this }
  }

  expand () : AST {
    const codeStyle : CodeStyle = { singleLetterVars : true, lambdaLetters : [ 'λ' ] }
    const value : number = <number> this.token.value
    const churchLiteral : string = `(λ s z .${' (s'.repeat(value)} z)${')'.repeat(value)}`

    return parse(Lexer.tokenize(churchLiteral, codeStyle))
  }

  reduceApplicative () : ReductionResult {
    throw new Error("Method not implemented.");
  }
  
  alphaConvert (oldName : string, newName : string) : AST {
    return this
  }
  
  betaReduce (argName : string, value : AST) : AST {
    return this // TODO: not clonning? IDK
  }
  
  etaConvert () : AST {
    throw new Error("Method not implemented.");
  }

  // print () : string {
  //   return this.name()
  // }

  freeVarName (bound : Array<string>) : string | null {
    return null
  }
}