import { Token } from '../lexer'
import { AST } from '.'
import { ASTVisitor } from '../visitors';


export class ChurchNumeral extends AST {
  constructor (
    public readonly token : Token,
    public readonly identifier : symbol = Symbol(),
  ) { super() }
    
  name () : string {
    return `${ this.token.value }`
  }
  
  clone () : ChurchNumeral {
    return new ChurchNumeral(this.token, this.identifier)
  }

  visit (visitor : ASTVisitor) : void {
    visitor.onChurchNumber(this)
  }
}