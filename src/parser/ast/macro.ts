import Lexer, { Token } from '../../lexer'
import { AST, ReductionResult, Reduction, Expandable, MacroDef } from '../parser'

export class Macro implements AST, Expandable {
  name () : string {
    return `${ this.token.value }`
  }

  constructor (
    public readonly token : Token,
    public readonly definition : MacroDef,
  ) {}

  clone () : Macro {
    return new Macro(this.token, this.definition)
  }

  reduceNormal () : ReductionResult {
    return { tree : this.expand(), reduced : true, reduction : Reduction.expansion, currentSubtree : this }
  }

  expand () : AST {
    // TODO: here I lose token - useful for location and origin of macro - should solve this
    return this.definition.ast.clone()
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