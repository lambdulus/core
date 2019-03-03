import Lexer, { Token } from '../../lexer'
import { AST, Binary, ReductionResult, Reduction, NextReduction, NextNone, Child } from '../parser'

export class Variable implements AST {
  public readonly identifier : symbol = Symbol()

  name () : string {
    return `${ this.token.value }`
  }

  constructor (
    public readonly token : Token,
  ) {}

  clone () : Variable {
    return new Variable(this.token)
  }

  nextNormal (parent : Binary | null, child : Child | null) : NextReduction {
    return new NextNone
  }

  reduceNormal () : ReductionResult {
    return { tree : this, reduced : false, reduction : Reduction.None, currentSubtree : this }
  }

  reduceApplicative () : ReductionResult {
    throw new Error("Method not implemented.");
  }
  
  alphaConvert (oldName : string, newName : string) : Variable {
    if (this.name() === oldName) {
      const token : Token = new Token(this.token.type, newName, this.token.position)
    
      return new Variable(token)
    }

    return this
  }
  
  betaReduce (argName : string, value : AST) : AST {
    if (this.name() === argName) {
      return value.clone()
    }
    
    return this
  }
  
  etaConvert () : AST {
    throw new Error("Method not implemented.");
  }

  print () : string {
    return this.name()
  }

  freeVarName (bound : Array<string>) : string | null {
    if (bound.includes(this.name())) {
      return null
    }    
    return this.name()
  }
}