import { Token } from '../lexer'
import { AST } from './'
import { MacroDef } from '../parser';
import { ASTVisitor } from '../visitors';


export class Macro extends AST {
  constructor (
    public readonly token : Token,
    public readonly definition : MacroDef,
    public readonly identifier : symbol = Symbol(),
  ) { super() }

  name () : string {
    return `${ this.token.value }`
  }

  clone () : Macro {
    return new Macro(this.token, this.definition, this.identifier)
  }

  visit (visitor : ASTVisitor) : void {
    visitor.onMacro(this)
  }
}