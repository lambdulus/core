import Lexer, { Token } from '../../lexer'
import { AST, Expandable, MacroDef } from '..'
import { Visitor } from '../../visitors/visitor';

export class Macro implements AST, Expandable {
  public readonly identifier : symbol = Symbol()

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

  visit (visitor : Visitor) : void {
    visitor.onMacro(this)
  }

  expand () : AST {
    // TODO: here I lose token - useful for location and origin of macro - should solve this
    // also consider not clonning
    return this.definition.ast.clone()
  }
  
  alphaConvert (oldName : string, newName : string) : AST {
    return this
  }
  
  betaReduce (argName : string, value : AST) : AST {
    return this
  }
  
  etaConvert () : AST {
    throw new Error("Method not implemented.");
  }

  freeVarName (bound : Array<string>) : string | null {
    return null
  }
}