import { Token } from '../lexer'
import { AST } from './'
import { ASTVisitor } from '../visitors';


export class ChurchNumber implements AST {
  public readonly identifier : symbol = Symbol()

  constructor (
    public readonly token : Token,
  ) {}
    
  name () : string {
    return `${ this.token.value }`
  }
  
  clone () : ChurchNumber {
    return new ChurchNumber(this.token)
  }

  visit (visitor : ASTVisitor) : void {
    visitor.onChurchNumber(this)
  }
}