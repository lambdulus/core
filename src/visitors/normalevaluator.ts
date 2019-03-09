import { ASTVisitor, Child, NextReduction, NextNone, NextAlpha, NextBeta, NextExpansion, SingleAlpha } from ".";
import { Binary, AST } from "../parser";
import { Application } from "../parser/ast/application";
import { Variable } from "../parser/ast/variable";
import { Lambda } from "../parser/ast/lambda";
import { ChurchNumber } from "../parser/ast/churchnumber";
import { Macro } from "../parser/ast/macro";
import { FreeVarsFinder } from "./freevarsfinder";
import { BasicPrinter } from "./basicprinter";

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

      // const freeVar : string | null = application.right.freeVarName([])

      // if (freeVar && application.left.isBound(freeVar) && application.left.argument.name() !== freeVar) {
      //   // TODO: refactor condition PLS it looks awful
      //   // second third mainly
      //   // TODO: find truly original non conflicting new name probably using number postfixes
      //   this.nextReduction = new NextAlpha(application, Child.Left, freeVar, `_${ freeVar }`)
      // }

      // TODO: now I rename in loop
      // for future - do it in single pass, all of them in single Visitor or something
      // YES in future there has to be something like NextMultiAlpha
      // which would get Map<string, Set<AST>> :> dictionary keyed by freeVarName with Set of every AST Node
      // refering to every occurence of this varName
      // there wont be this loop
      // only map which will connect varName with Set
      // then all varNames with empty Sets ( those are unbound ) will be filtered
      // maybe there is no need for AST Nodes I should think about it

      //TODO: IMPORTANT - this is exactly right idea, there is really sense in renaming all of free at once
      // const toRename : AlphaMap = new Map
      const alphas : Array<SingleAlpha> = []
      for (const varName of freeVars) {
        // TODO: tohle vyresim refactorem isBound()
        const lambda : Lambda | null = application.left.isBound(varName)

        if (lambda && application.left.argument.name() !== varName) {
          alphas.push({ tree : <Lambda> lambda, oldName : varName, newName : `_${ varName }` })
        }
      }

      if (alphas.length) {
        this.nextReduction = new NextAlpha(alphas)
      }
      else {
        // search for free Vars in right which are bound in left OK
        // if any, do α conversion and return
  
        // if none, do β reduction and return
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