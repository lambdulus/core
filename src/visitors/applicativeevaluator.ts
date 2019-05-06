import { ASTVisitor } from "."
import { FreeVarsFinder } from "./freevarsfinder"
import { Binary, AST, Child, Application, Lambda, ChurchNumber, Macro, Variable } from "../ast"
import { BoundingFinder } from "./boundingfinder"
import { constructFor, Reducer } from "../reducers";
import { ASTReduction, Beta, Alpha, Expansion, None } from "../reductions";


export class ApplicativeEvaluator extends ASTVisitor {
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
    if (application.left instanceof Lambda) {
      const parent : Binary | null = this.parent
      const child : Child | null = this.child

      // first reduce argument
      this.parent = application
      this.child = Child.Right
      application.right.visit(this)

      if (this.nextReduction instanceof None) {
        // argument is in normal form
        const freeVarsFinder : FreeVarsFinder = new FreeVarsFinder(application.right)
        const freeVars : Set<string> = freeVarsFinder.freeVars

        const boundingfinder : BoundingFinder = new BoundingFinder(application.left, freeVars)
        const lambdas : Set<Lambda> = boundingfinder.lambdas

        if (lambdas.size) {
          this.nextReduction = new Alpha(lambdas)
        }
        else {
          this.nextReduction = new Beta(application, parent, child, application.left.body, application.left.argument.name(), application.right)
        }
      }
    }

    else if (application.left instanceof Application) {
      this.parent = application
      this.child = Child.Left

      application.left.visit(this)

      if (this.nextReduction instanceof None) {
        this.parent = application
        this.child = Child.Right

        application.right.visit(this)
      }
    }

    // (application.left instanceof Macro || application.left instanceof ChurchNumber || application.left instanceof Variable)
    else {
      this.parent = application
      this.child = Child.Right

      application.right.visit(this)

      if (this.nextReduction instanceof None) {
        this.parent = application
        this.child = Child.Left

        application.left.visit(this)
      }
    }
  }
  
  onLambda (lambda : Lambda) : void {
    this.nextReduction = new None
    // this.parent = lambda
    // this.child = Child.Right

    // lambda.body.visit(this)
  }

  onChurchNumber (churchNumber : ChurchNumber) : void {
    this.nextReduction = new Expansion(this.parent, this.child, churchNumber)
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