import { ASTVisitor } from ".";
import { Application } from "../parser/ast/application";
import { Lambda } from "../parser/ast/lambda";
import { ChurchNumber } from "../parser/ast/churchnumber";
import { Macro } from "../parser/ast/macro";
import { Variable } from "../parser/ast/variable";
import { AST } from "../parser";

export class FreeVarsFinder implements ASTVisitor {
  private bound : Set<string> = new Set

  public freeVars : Set<string> = new Set
  constructor (private readonly tree : AST) {
    tree.visit(this)
  }

  onApplication(application : Application) : void {
    application.left.visit(this)
    application.right.visit(this)
  }

  onLambda(lambda : Lambda) : void {
    this.bound.add(lambda.argument.name())
    lambda.body.visit(this)
  }

  onChurchNumber(churchNumber : ChurchNumber) : void {
    // nothing
  }

  onMacro(macro : Macro) : void {
    // nothing
  }

  onVariable(variable : Variable) : void {
    if ( ! this.bound.has(variable.name())) {
      this.freeVars.add(variable.name())
    }
  }
}