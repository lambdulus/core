import { AST } from "../ast"
import { Application, Lambda, Variable } from "../ast"
import { ASTVisitor } from "."


export class FreeVarsFinder extends ASTVisitor {
  // Binder depth per name: a plain set leaks under shadowing (an inner
  // binder's exit would unbind an outer binder of the same name, e.g. the
  // inner `n` of `/` unbinding the outer one for the later `(SUC n)`).
  private bound : Map<string, number> = new Map

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
    const argument : string = lambda.argument.name()
    this.bound.set(argument, (this.bound.get(argument) ?? 0) + 1)
    lambda.body.visit(this)
    const depth : number = (this.bound.get(argument) ?? 1) - 1
    if (depth <= 0) {
      this.bound.delete(argument)
    }
    else {
      this.bound.set(argument, depth)
    }
  }

  onVariable(variable : Variable) : void {
    if ( ! this.bound.has(variable.name())) {
      this.freeVars.add(variable.name())
    }
  }
}