import { ASTVisitor } from "."
import { Application, Lambda, Variable } from "../ast/"


export class BoundingFinder extends ASTVisitor {
  public lambdas : Set<Lambda> = new Set

  private argName : string
  private unboundVars : Set<string> = new Set

  constructor (
    public tree : Lambda,
    public freeVars : Set<string>
  ) {
    super()
    this.argName = tree.argument.name()

    tree.body.visit(this)
  }

  onApplication (application : Application) : void {
    const unbounds : Set<string> = new Set(this.unboundVars)
    let combined : Set<string> = new Set

    application.left.visit(this)
    combined = new Set([...combined.values(), ...this.unboundVars.values()])
    this.unboundVars = unbounds

    application.right.visit(this)
    combined = new Set([...combined.values(), ...this.unboundVars.values()])
    this.unboundVars = combined
  }
  
  onLambda (lambda : Lambda) : void {
    if (lambda.argument.name() === this.argName) {
      return
    }

    lambda.body.visit(this)

    this.unboundVars.delete(lambda.argument.name()) // binding argument name

    if (this.unboundVars.has(this.argName)
        &&
        this.freeVars.has(lambda.argument.name())
    ) {
      this.lambdas.add(lambda)
    }
  }

  onVariable (variable : Variable) {
    this.unboundVars.add(variable.name())
  }
}