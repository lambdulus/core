import { ASTVisitor, Child, NextReduction, NextNone, NextAlpha, NextBeta, NextExpansion, SingleAlpha } from ".";
import { Binary, AST } from "../parser";
import { Application } from "../parser/ast/application";
import { Variable } from "../parser/ast/variable";
import { Lambda } from "../parser/ast/lambda";
import { ChurchNumber } from "../parser/ast/churchnumber";
import { Macro } from "../parser/ast/macro";
import { FreeVarsFinder } from "./freevarsfinder";
import { VarBindFinder } from "./varbindfinder";

export class NormalEvaluator implements ASTVisitor {
  private parent : Binary | null = null
  private child : Child | null = null

  public nextReduction : NextReduction = new NextNone

  constructor (
    public readonly tree : AST
  ) {
    this.tree.visit(this)
  }

  onApplication(application : Application) : void {
    if (application.left instanceof Variable) {
      this.parent = application
      this.child = Child.Right
      application.right.visit(this)
    }

    else if (application.left instanceof Lambda) {
      const freeVarsFinder : FreeVarsFinder = new FreeVarsFinder(application.right)
      const freeVars : Set<string> = freeVarsFinder.freeVars

      //TODO: IMPORTANT - this is exactly right idea, there is really sense in renaming all of free at once
      const alphas : Array<SingleAlpha> = []
      for (const varName of freeVars) {
        const binder : VarBindFinder = new VarBindFinder(application.left, varName)
        const lambda : Lambda | null = binder.lambda

        if (lambda && application.left.argument.name() !== varName) {
          // TODO: find truly original non conflicting new name probably using number postfixes
          alphas.push({ tree : <Lambda> lambda, oldName : varName, newName : `_${ varName }` })
        }
      }

      if (alphas.length) {
        this.nextReduction = new NextAlpha(alphas)
      }
      else {
        this.nextReduction = new NextBeta(this.parent, this.child, application.left.body, application.left.argument.name(), application.right)
      }
    }

    else { // (this.left instanceof Macro || this.left instanceof ChurchNumber)
      this.parent = application
      this.child = Child.Left

      application.left.visit(this)
    }
  }
  
  onLambda(lambda : Lambda) : void {
    this.parent = lambda
    this.child = Child.Right

    lambda.body.visit(this)
  }

  onChurchNumber(churchNumber : ChurchNumber) : void {
    this.nextReduction = new NextExpansion(this.parent, this.child, churchNumber)
  }

  onMacro(macro : Macro) : void {
    this.nextReduction = new NextExpansion(this.parent, this.child, macro)
  }

  onVariable(variable : Variable) : void {
    this.nextReduction = new NextNone
  }
}