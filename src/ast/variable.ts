import { Token } from '../lexer'
import { AST } from './'
import { ASTVisitor } from '../visitors';

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

  visit (visitor : ASTVisitor) : void {
    visitor.onVariable(this)
  }
}