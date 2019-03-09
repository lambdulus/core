import Lexer, { Token, CodeStyle } from '../../lexer'
import { AST, parse } from '..'
import { ASTVisitor } from '../../visitors';

export class ChurchNumber implements AST {
  public readonly identifier : symbol = Symbol()

  name () : string {
    return `${ this.token.value }`
  }

  constructor (
    public readonly token : Token,
  ) {}
  
  clone () : ChurchNumber {
    return new ChurchNumber(this.token)
  }

  visit (visitor : ASTVisitor) : void {
    visitor.onChurchNumber(this)
  }
}