import { ASTVisitor } from ".";
import { Lambda } from "../ast/lambda";
import { ChurchNumber } from "../ast/churchnumber";
import { Macro } from "../ast/macro";
import { Variable } from "../ast/variable";
import { Application } from "../ast/application";
import { FreeVarsFinder } from "./freevarsfinder";

export class BoundingFinder implements ASTVisitor {
  public lambdas : Set<Lambda> = new Set

  private argName : string

  constructor (
    public tree : Lambda,
    public freeVars : Set<string>
  ) {
    this.argName = tree.argument.name()

    tree.body.visit(this)
  }

  onApplication(application : Application) : void {
    application.left.visit(this)
    application.right.visit(this)
  }
  
  onLambda(lambda : Lambda) : void {
    const freeVarsFinder : FreeVarsFinder = new FreeVarsFinder(lambda.body)
    if (freeVarsFinder.freeVars.has(this.argName)
        &&
        this.freeVars.has(lambda.argument.name())
    ) {
      this.lambdas.add(lambda)
    }

    lambda.body.visit(this)
  }

  onChurchNumber(churchNumber : ChurchNumber) : void {
    // nothing
  }

  onMacro(macro : Macro) : void {
    // nothing
  }

  onVariable(variable : Variable) : void {
    // nothing
  }
}