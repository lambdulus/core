import { ASTVisitor } from "../visitors"
import { FreeVarsFinder } from "../visitors/freevarsfinder"
import { Binary, AST, Child, Application, Lambda, ChurchNumeral, Macro, Variable } from "../ast"
import { BoundingFinder } from "../visitors/boundingfinder"
import { constructFor, Reducer } from "../reducers"
import { ASTReduction, Beta, Alpha, Expansion, None, Gama, arity } from "../reductions"





////////////////////////////////////////////////////////////
export class NormalAbstractionEvaluator extends ASTVisitor {
  private parent : Binary | null = null
  private child : Child | null = null

  private originalReduction : ASTReduction = new None
  public nextReduction : ASTReduction = new None
  public reducer : Reducer

  // TODO: refactor this out - to reducer file
  // make it { [ name : string ] : pair<arity, function> }
  // then create helper functions for getting parts of it -> for Gama constructor and so on
  // this will solve the redundancy of identifiers
  // NOPE
  // udelam z toho normalne class
  // bude mit normalne metodu knows() / has()
  // bude mit neco getArity(name : string) : number
  // bude mit neco jako getAssertion(name : string, arguments : Array<GamaArg>) : boolean
  // getEvaluation(name : string) : Function
  private knownAbstraction : { [name : string] : arity } = {
    'ZERO' : 1,
    'PRED' : 1,
    'SUC' : 1,
    'AND' : 2,
    'OR' : 2,
    'NOT' : 1,
    '+' : 2,
    '-' : 2,
    '*' : 2,
    '/' : 2,
    '^' : 2,
    'DELTA' : 2,
    '=' : 2,
    '>' : 2,
    '<' : 2,
    '>=' : 2,
    '<=' : 2,
  }

  constructor (
    public readonly tree : AST
  ) {
    super()
    this.tree.visit(this)

    try {
      this.reducer = constructFor(tree, this.nextReduction)
    }
    catch (exception) {
      this.nextReduction = this.originalReduction
      this.reducer = constructFor(tree, this.nextReduction)
    }
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

      const boundingfinder : BoundingFinder = new BoundingFinder(application.left, freeVars)
      const lambdas : Set<Lambda> = boundingfinder.lambdas

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

      if (this.nextReduction instanceof Gama
          &&
          this.nextReduction.redexes.includes(<Macro>application.left)
          &&
          this.nextReduction.args.length < this.nextReduction.abstraction[1]
        ) {
          this.nextReduction.redexes.push(application)
          // TODO: refactor this please
          if (
            application.right instanceof Variable
            ||
            application.right instanceof Macro
            ||
            application.right instanceof ChurchNumeral
            ||
            application.right instanceof Lambda          
            ) {
              this.nextReduction.args.push(application.right)
          }        
      }

      if (this.nextReduction instanceof None) {
        this.parent = application
        this.child = Child.Right

        application.right.visit(this)
      }
    }
  }
  
  // na lambde bych se zastavil - to se stane samo - tim, ze se lambda neulozi do sequence redexu
  onLambda (lambda : Lambda) : void {
    this.parent = lambda
    this.child = Child.Right

    lambda.body.visit(this)
  }

  onChurchNumeral (churchNumeral : ChurchNumeral) : void {
    this.nextReduction = new Expansion(this.parent, this.child, churchNumeral)
  }

  onMacro (macro : Macro) : void {
    this.originalReduction = new Expansion(this.parent, this.child, macro)
    this.nextReduction = this.originalReduction
    
    const macroName : string = macro.name()
    
    if (macroName in this.knownAbstraction) {
      this.nextReduction = new Gama(
        [ macro ],
        [],
        this.parent,
        this.child,
        [ macroName, this.knownAbstraction[macroName] ] // TODO: refactor with some helper function
      )
    }
  }

  onVariable (variable : Variable) : void {
    this.nextReduction = new None
  }

  perform () : AST {
    this.reducer.perform()
    return this.reducer.tree
  }
}