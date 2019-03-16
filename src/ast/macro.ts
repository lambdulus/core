import { Token } from '../lexer'
import { AST } from './'
import { MacroDef } from '../parser';
import { ASTVisitor } from '../visitors';


export class Macro implements AST {
  public readonly identifier : symbol = Symbol()

  constructor (
    public readonly token : Token,
    public readonly definition : MacroDef,
  ) {}

  name () : string {
    return `${ this.token.value }`
  }

  clone () : Macro {
    return new Macro(this.token, this.definition)
  }

  visit (visitor : ASTVisitor) : void {
    visitor.onMacro(this)
  }
}