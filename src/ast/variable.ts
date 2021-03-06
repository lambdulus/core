import { Token } from '../lexer'
import { AST } from './'
import { ASTVisitor } from '../visitors'


export class Variable extends AST {
  type : string = 'variable'

  constructor (
    public readonly token : Token,
    public readonly identifier : symbol = Symbol(),
  ) { super() }
    
  name () : string {
    return `${ this.token.value }`
  }

  clone () : Variable {
    return new Variable(this.token, this.identifier)
  }

  visit (visitor : ASTVisitor) : void {
    visitor.onVariable(this)
  }
}