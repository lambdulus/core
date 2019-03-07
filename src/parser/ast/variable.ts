import Lexer, { Token } from '../../lexer'
import { AST } from '..'
import { Visitor } from '../../visitors/visitor';

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

  visit (visitor : Visitor) : void {
    visitor.onVariable(this)
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

  freeVarName (bound : Array<string>) : string | null {
    if (bound.includes(this.name())) {
      return null
    }    
    return this.name()
  }
}