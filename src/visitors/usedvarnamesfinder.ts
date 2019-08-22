import { AST } from "../ast";
import { Application, Lambda, Variable } from "../ast";
import { ASTVisitor } from ".";


export class UsedVarNamesFinder extends ASTVisitor {
  public used : Set<string> = new Set

  constructor (private readonly tree : AST) {
    super()
    tree.visit(this)
  }

  onApplication(application : Application) : void {
    application.left.visit(this)
    application.right.visit(this)
  }

  onLambda(lambda : Lambda) : void {
    lambda.argument.visit(this)
    lambda.body.visit(this)
  }

  onVariable(variable : Variable) : void {
    this.used.add(variable.name())
  }
}