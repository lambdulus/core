import { AST, Binary } from './'
import { ASTVisitor } from '../visitors'


export class Application implements AST, Binary {
  // public readonly identifier : symbol = Symbol()

  constructor (
    public left : AST,
    public right : AST,
    public readonly identifier : symbol = Symbol(),
  ) {}

  clone () : Application {
    return new Application(this.left.clone(), this.right.clone(), this.identifier)
  }

  visit (visitor : ASTVisitor) : void {
    return visitor.onApplication(this)
  }
}