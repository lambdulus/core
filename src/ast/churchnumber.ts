import { Token } from '../lexer'
import { AST } from './'
import { ASTVisitor } from '../visitors';


export class ChurchNumber implements AST {
  // public readonly identifier : symbol = Symbol()

  constructor (
    public readonly token : Token,
    public readonly identifier : symbol = Symbol(),
  ) {}
    
  name () : string {
    return `${ this.token.value }`
  }
  
  clone () : ChurchNumber {
    return new ChurchNumber(this.token, this.identifier)
  }

  visit (visitor : ASTVisitor) : void {
    visitor.onChurchNumber(this)
  }
}