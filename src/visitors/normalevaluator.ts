import { ASTVisitor, Child, Reductions } from "."
import { FreeVarsFinder } from "./freevarsfinder"
import { Binary, AST } from "../ast"
import { Application } from "../ast/application"
import { Variable } from "../ast/variable"
import { Lambda } from "../ast/lambda"
import { ChurchNumber } from "../ast/churchnumber"
import { Macro } from "../ast/macro"
import { BoundingFinder } from "./boundingfinder"
import { ReducerFactory } from "../reducers/reducerfactory";

export interface Reducer {
  tree : AST
  perform () : void
}


export class NormalEvaluator extends ASTVisitor {
  private parent : Binary | null = null
  private child : Child | null = null

  public nextReduction : Reductions.ASTReduction = new Reductions.None
  public reducer : Reducer

  constructor (
    public readonly tree : AST
  ) {
    super()
    this.tree.visit(this)

    this.reducer = ReducerFactory.constructFor(tree, this.nextReduction)
  }

  onApplication (application : Application) : void {
    if (application.left instanceof Variable) {
      // TODO: fakt to je jenom pokud to nalevo je Var?
      // co kdyz to nalevo neni var, ale nejde to nijak zjednodusit
      // nemel bych to nejak osetrit?
      // napis si na to nejakej TEST
      this.parent = application
      this.child = Child.Right
      application.right.visit(this)
    }

    else if (application.left instanceof Lambda) {
      const freeVarsFinder : FreeVarsFinder = new FreeVarsFinder(application.right)
      const freeVars : Set<string> = freeVarsFinder.freeVars

      const boundingfinder : BoundingFinder = new BoundingFinder(application.left, freeVars)
      const lambdas : Set<Lambda> = boundingfinder.lambdas

      if (lambdas.size) {
        this.nextReduction = new Reductions.Alpha(lambdas)
      }
      else {
        this.nextReduction = new Reductions.Beta(this.parent, this.child, application.left.body, application.left.argument.name(), application.right)
      }
    }

    else { // (this.left instanceof Macro || this.left instanceof ChurchNumber)
      this.parent = application
      this.child = Child.Left

      application.left.visit(this)
    }
  }
  
  onLambda (lambda : Lambda) : void {
    this.parent = lambda
    this.child = Child.Right

    lambda.body.visit(this)
  }

  onChurchNumber (churchNumber : ChurchNumber) : void {
    this.nextReduction = new Reductions.Expansion(this.parent, this.child, churchNumber)
  }

  onMacro (macro : Macro) : void {
    this.nextReduction = new Reductions.Expansion(this.parent, this.child, macro)
  }

  onVariable (variable : Variable) : void {
    this.nextReduction = new Reductions.None
  }

  perform () : AST {
    this.reducer.perform()
    return this.reducer.tree
  }
}