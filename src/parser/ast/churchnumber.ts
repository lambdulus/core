import Lexer, { Token, CodeStyle } from '../../lexer'
import { AST, ReductionResult, Reduction, Expandable, parse } from '../parser'

export class ChurchNumber implements AST, Expandable {
  name () : string {
    return `${ this.token.value }`
  }

  public readonly ast: AST;

  constructor (
    public readonly token : Token,
  ) {}
  
  clone () : ChurchNumber {
    return new ChurchNumber(this.token)
  }
  
  reduceNormal () : ReductionResult {
    return { tree : this.expand(), reduced : true, reduction : Reduction.expansion, currentSubtree : this }
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

  print () : string {
    return this.name()
  }

  freeVarName (bound : Array<string>) : string | null {
    return null
  }
}