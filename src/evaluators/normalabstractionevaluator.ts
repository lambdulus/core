import { ASTVisitor } from "../visitors"
import { FreeVarsFinder } from "../visitors/freevarsfinder"
import { Binary, AST, Child, Application, Lambda, ChurchNumeral, Macro, Variable } from "../ast"
import { BoundingFinder } from "../visitors/boundingfinder"
import { constructFor, Reducer } from "../reducers"
import { ASTReduction, Beta, Alpha, Expansion, None, Gama } from "../reductions"
import { Abstractions } from "../reducers/abstractions"
import { builtinMacros } from "../parser";


export class NormalAbstractionEvaluator extends ASTVisitor {
  private originalParent : Binary | null = null
  private parent : Binary | null = null
  private child : Child | null = null

  private originalReduction : ASTReduction = new None
  public nextReduction : ASTReduction = new None
  public reducer : Reducer

  constructor (
    public readonly tree : AST
  ) {
    super()
    this.tree.visit(this)

    try {
      this.reducer = constructFor(tree, this.nextReduction)
    }
    catch (exception) {
      if (this.nextReduction instanceof Gama) {
        this.nextReduction.parent = this.originalParent
      }

      this.nextReduction = this.originalReduction
      this.reducer = constructFor(tree, this.nextReduction)
    }
  }

  onApplication (application : Application) : void {
    const parent : Binary | null = this.parent // backup
    let treeSide : Child | null = this.child

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
          this.nextReduction.redexes.includes(<Macro>application.left) // TODO: nalevo nebude vzdycky macro // TODO: jakto ze to bude vzdycky makro?
          &&
          this.nextReduction.args.length < this.nextReduction.abstraction[1] // TODO: udelej z toho vlastni prop nextReduction.arity
        ) {
          // TODO: tohle je spatne - vubec mi nemusi vadit, ze right je APP
          // jsou makra ktera to nezajima [T, F]
          // proto musim zmenit Abstraction a mit tam misto/navic funkce assert
          // jeste list typu argumentu nebo tak neco
            // if (application.right instanceof Application) {
            //   this.nextReduction = new None
            // }
            // TODO: tohle je jenom prozatim - ted je problem aplikaci kdyz je right - tak to rovnou
            // testnu pokud je right applikace - v budoucnu to chci lip - nejak univerzalne bez ifu
            const macroName : string = (<Macro> this.nextReduction.redexes[0]).name()
            const argumentIndex : number = this.nextReduction.args.length

            if (application.right instanceof Application) {
              console.log('budu delat nejaky testy ' + argumentIndex + ' ' + macroName)
              console.log(Abstractions.inAllowedTypesFor(macroName, argumentIndex, Application))
              console.log()
            }

            if (application.right instanceof Application && ! Abstractions.inAllowedTypesFor(macroName, argumentIndex, Application)) {
              this.nextReduction = new None
            }
            else {
              this.nextReduction.args.push(application.right)
              this.nextReduction.parent = parent
              this.nextReduction.treeSide = treeSide
              this.nextReduction.redexes.push(application)
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
    this.nextReduction = new None

    // if (this.parent === null) {
    //   this.nextReduction = new None
    //   return
    // }

    // this.nextReduction = new Expansion(this.parent, this.child, churchNumeral)
  }

  onMacro (macro : Macro) : void {
    if ( ! (macro.name() in builtinMacros)) {
      this.originalReduction = new Expansion(this.parent, this.child, macro)
      this.nextReduction = this.originalReduction
      this.originalParent = this.parent
      return
    }
    // this.originalReduction = new Expansion(this.parent, this.child, macro)
    // TODO: if it is not in builtIn macros - than it is user-defined macro - and I should maybe expand it
    this.originalReduction = new None
    this.nextReduction = this.originalReduction

    this.originalParent = this.parent
    
    const macroName : string = macro.name()

    if (Abstractions.has(macroName)) {
      this.nextReduction = new Gama(
        [ macro ],
        [],
        this.parent,
        this.child,
        [ macroName, Abstractions.getArity(macroName) ], // TODO: refactor with some helper function
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