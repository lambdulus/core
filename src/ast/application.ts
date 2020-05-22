import { AST, Binary } from './'
import { ASTVisitor } from '../visitors'


export class Application extends AST implements Binary {
  type : string = 'application'

  constructor (
    public left : AST,
    public right : AST,
    public readonly identifier : symbol = Symbol(),
  ) { super() }

  clone () : Application {
    return new Application(this.left.clone(), this.right.clone(), this.identifier)
  }

  visit (visitor : ASTVisitor) : void {
    return visitor.onApplication(this)
  }
}