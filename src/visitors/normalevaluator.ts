import { ASTVisitor, Child, NextReduction, NextNone, NextAlpha, NextBeta, NextExpansion } from ".";
import { FreeVarsFinder } from "./freevarsfinder";
import { Binary, AST } from "../ast";
import { Application } from "../ast/application";
import { Variable } from "../ast/variable";
import { Lambda } from "../ast/lambda";
import { ChurchNumber } from "../ast/churchnumber";
import { Macro } from "../ast/macro";
import { BoundingFinder } from "./boundingfinder";

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

      const boundingfinder : BoundingFinder = new BoundingFinder(application.left, freeVars)
      const lambdas : Set<Lambda> = boundingfinder.lambdas
      

      // for (const varName of freeVars) {
      //   const binder : VarBindFinder = new VarBindFinder(application.left, varName)
      //   const lambda : Lambda | null = binder.lambda

      //   if (lambda && application.left.argument.name() !== varName) {
      //     // TODO: nevytvaret tady novy jmeno, nechat to primo na implementaci alfa konverze
      //     alphas.push({ tree : <Lambda> lambda, oldName : varName, newName : `_${ varName }` })
      //   }
      // }

      if (lambdas.size) {
        this.nextReduction = new NextAlpha(lambdas)
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