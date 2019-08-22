import { ASTVisitor } from "../visitors"
import { FreeVarsFinder } from "../visitors/freevarsfinder"
import { Binary, AST, Child, Application, Lambda, ChurchNumeral, Macro, Variable } from "../ast"
import { BoundingFinder } from "../visitors/boundingfinder"
import { constructFor, Reducer } from "../reducers";
import { ASTReduction, Beta, Alpha, Expansion, None } from "../reductions";


export class NormalEvaluator extends ASTVisitor {
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
    if (application.left instanceof Variable) {
      this.parent = application
      this.child = Child.Right
      application.right.visit(this)
    }

    else if (application.left instanceof Lambda) {
      const freeVarsFinder : FreeVarsFinder = new FreeVarsFinder(application.right)
      const freeVars : Set<string> = freeVarsFinder.freeVars

      const boundingFinder : BoundingFinder = new BoundingFinder(application.left, freeVars)
      const lambdas : Set<Lambda> = boundingFinder.lambdas

      if (lambdas.size) {
        this.nextReduction = new Alpha(lambdas)
      }
      else {
        this.nextReduction = new Beta(application, this.parent, this.child, application.left.body, application.left.argument.name(), application.right)
      }
    }

    // (this.left instanceof Macro || this.left instanceof ChurchNumeral || this.left instanceof Application)
    else {
      this.parent = application
      this.child = Child.Left

      application.left.visit(this)

      if (this.nextReduction instanceof None) {
        this.parent = application
        this.child = Child.Right

        application.right.visit(this)
      }
    }
  }
  
  onLambda (lambda : Lambda) : void {
    this.parent = lambda
    this.child = Child.Right

    lambda.body.visit(this)
  }

  onChurchNumeral (churchNumeral : ChurchNumeral) : void {
    this.nextReduction = new Expansion(this.parent, this.child, churchNumeral)
  }

  onMacro (macro : Macro) : void {
    this.nextReduction = new Expansion(this.parent, this.child, macro)
  }

  onVariable (variable : Variable) : void {
    this.nextReduction = new None
  }

  perform () : AST {
    this.reducer.perform()
    return this.reducer.tree
  }
}