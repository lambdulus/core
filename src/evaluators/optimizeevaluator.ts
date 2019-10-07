import { ASTVisitor } from "../visitors"
import { FreeVarsFinder } from "../visitors/freevarsfinder"
import { Binary, AST, Child, Application, Lambda, Variable } from "../ast"
// import { BoundingFinder } from "./boundingfinder"
import { constructFor, Reducer } from "../reducers"
import { ASTReduction, None } from "../reductions"
import { Eta } from "../reductions/eta"


export class OptimizeEvaluator extends ASTVisitor {
  private parent : Binary | null = null
  private child : Child | null = null

  public nextReduction : ASTReduction = new None
  public reducer : Reducer

  constructor (
    public readonly tree : AST
  ) {
    super()
    this.tree.visit(this)

    this.reducer = constructFor(tree, this.nextReduction)
  }

  onApplication (application : Application) : void {
    this.parent = application
    this.child = Child.Left

    application.left.visit(this)

    if (this.nextReduction instanceof None) {
      this.parent = application
      this.child = Child.Right

      application.right.visit(this)
    }
  }
  
  onLambda (lambda : Lambda) : void {
    if (lambda.right instanceof Application
        &&
        lambda.right.right instanceof Variable
        &&
        lambda.right.right.name() === lambda.left.name()
    ) {
      const freeVarsFinder : FreeVarsFinder = new FreeVarsFinder(lambda.right.left)
      const freeVars : Set<string> = freeVarsFinder.freeVars
      
      if ( ! freeVars.has(lambda.left.name())) {
        this.nextReduction = new Eta(this.parent, this.child, lambda.right.left)
        return
      }
    }

    this.parent = lambda
    this.child = Child.Right

    lambda.body.visit(this)
  }

  perform () : AST {
    this.reducer.perform()
    return this.reducer.tree
  }
}