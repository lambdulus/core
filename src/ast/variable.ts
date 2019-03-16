import { Token } from '../lexer'
import { AST } from './'
import { ASTVisitor } from '../visitors';


export class Variable implements AST {
  public readonly identifier : symbol = Symbol()

  constructor (
    public readonly token : Token
  ) {}
    
  name () : string {
    return `${ this.token.value }`
  }

  clone () : Variable {
    return new Variable(this.token)
  }

  visit (visitor : ASTVisitor) : void {
    visitor.onVariable(this)
  }
}