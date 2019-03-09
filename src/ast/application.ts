import { AST, Binary } from './'
import { ASTVisitor } from '../visitors'

export class Application implements AST, Binary {
  public readonly identifier : symbol = Symbol()

  constructor (
    public left : AST,
    public right : AST,
  ) {}

  clone () : Application {
    return new Application(this.left.clone(), this.right.clone())
  }

  visit (visitor : ASTVisitor) : void {
    return visitor.onApplication(this)
  }
}