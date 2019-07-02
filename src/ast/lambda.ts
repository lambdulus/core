import { AST, Binary, Variable } from './'
import { ASTVisitor } from '../visitors';


export class Lambda extends AST implements Binary {
  constructor (
    public argument : Variable,
    public body : AST,
    public readonly identifier : symbol = Symbol(),
  ) { super() }

  public get left () {
    return this.argument
  }

  public set left (argument : Variable) {
    this.argument = argument
  }

  public get right () {
    return this.body
  }

  public set right (body : AST) {
    this.body = body
  }

  clone () : Lambda {
    return new Lambda(this.argument.clone(), this.body.clone(), this.identifier)
  }

  visit (visitor : ASTVisitor) : void {
    visitor.onLambda(this)
  }
}