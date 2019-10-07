import { AST } from "../ast"
import { Application, Lambda, Variable } from "../ast"
import { ASTVisitor } from "."


export class FreeVarsFinder extends ASTVisitor {
  private bound : Set<string> = new Set

  public freeVars : Set<string> = new Set

  constructor (private readonly tree : AST) {
    super()
    tree.visit(this)
  }

  onApplication(application : Application) : void {
    application.left.visit(this)
    application.right.visit(this)
  }

  onLambda(lambda : Lambda) : void {
    this.bound.add(lambda.argument.name())
    lambda.body.visit(this)
    this.bound.delete(lambda.argument.name())
  }

  onVariable(variable : Variable) : void {
    if ( ! this.bound.has(variable.name())) {
      this.freeVars.add(variable.name())
    }
  }
}