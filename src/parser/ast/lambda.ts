import { AST, Binary } from '..'
import { Variable } from './variable'
import { ASTVisitor } from '../../visitors';

export class Lambda implements AST, Binary {
  public readonly identifier : symbol = Symbol()

  constructor (
    public argument : Variable,
    public body : AST
  ) {}

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
    // TODO: consider not clonning
    return new Lambda(this.argument.clone(), this.body.clone())
  }

  visit (visitor : ASTVisitor) : void {
    visitor.onLambda(this)
  }
}