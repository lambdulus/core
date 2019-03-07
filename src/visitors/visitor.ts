import Parser, { AST, Binary, Expandable } from '../parser'
import { Application } from '../parser/ast/application'
import { Lambda } from '../parser/ast/lambda'
import { ChurchNumber } from '../parser/ast/churchnumber'
import { Macro } from '../parser/ast/macro'
import { Variable } from '../parser/ast/variable'

export enum Child {
  Left = 'left',
  Right = 'right',
}

// TODO: tohle nahradi konkretni druh Visitoru neco jako NormalReductionFinder/NormReductionFinder
// dalsi pripad bude AppReductionFinder
// dalsi bude TreePrinter
// a tu spodni informaci bude v sobe drzet konkretni Visitor
export type NextReduction = NextAlpha | NextBeta | NextExpansion | NextNone

export class NextAlpha {
  constructor (
    public readonly tree : Application,
    public readonly child : Child,
    public readonly oldName : string,
    public readonly newName : string,
    // TODO:
    // taky mnozinu referenci na vyskyty promennych tam, kde se budou nahrazovat
    // at to nemusi implementace hledat, proste doslova jenom prohazi ??? -> zvazit
  ) {}
}

export class NextBeta {
  constructor (
    public readonly parent : Binary | null,
    public readonly treeSide : Child | null, // na jaky strane pro parenta je redukovanej uzel
    public readonly target : AST, // EXPR ve kterem se provede nahrada
    public readonly argName : string,
    public readonly value : AST,
  ) {}
}

// TODO: vyresit pro pripady kdy jde o multilambdu
// pak bude navic drzet mnozinu values a mnozinu arguments
// spis mnozinu tuples

export class NextExpansion {
  constructor (
    public readonly parent : Binary | null,
    public readonly treeSide : Child | null,
    public readonly tree : Expandable,
  ) {}
}

export class NextNone {}


export interface Visitable {
  visit(visitor : Visitor) : void,
}

export interface Visitor {
  onApplication (application : Application) : void,
  onLambda (lambda : Lambda) : void,
  onChurchNumber (churchnumber : ChurchNumber) : void,
  onMacro (macro : Macro) : void,
  onVariable (variable : Variable) : void,
}


export class NormalEvaluation implements Visitor {
  private parent : Binary | null = null
  private child : Child | null = null

  public nextReduction : NextReduction = NextNone

  constructor (
    public readonly tree : AST
    ) {
      this.tree.visit(this)
  }

  evaluate () : AST {
    if (this.nextReduction instanceof NextAlpha) {
      const { tree, child, oldName, newName } = this.nextReduction
      tree[<Child> child] = tree[<Child> child].alphaConvert(oldName, newName)

      return this.tree
    }
    
    else if (this.nextReduction instanceof NextBeta) {
      const { parent, treeSide, target, argName, value } = this.nextReduction
      const substituted : AST = target.betaReduce(argName, value)

      if (parent === null) {
        return substituted
      }
      else {
        parent[<Child> treeSide] = substituted

        return this.tree
      }
    }

    else if (this.nextReduction instanceof NextExpansion) {
      const { parent, treeSide, tree } = this.nextReduction
      const expanded : AST = tree.expand()

      if (parent === null) {
        return expanded
      }
      else {
        parent[<Child> treeSide] = expanded

        return this.tree
      }
    }

    else { // instanceof NextNone
      return this.tree
    }  
  }

  onApplication(application: Application): void {
    if (application.left instanceof Variable) {
      this.parent = application
      this.child = Child.Right
      application.right.visit(this)
    }

    else if (application.left instanceof Lambda) {
      const freeVar : string | null = application.right.freeVarName([])

      if (freeVar && application.left.isBound(freeVar) && application.left.argument.name() !== freeVar) {
        // TODO: refactor condition PLS it looks awful
        // second third mainly
        // TODO: find truly original non conflicting new name probably using number postfixes
        this.nextReduction = new NextAlpha(application, Child.Left, freeVar, `_${ freeVar }`)
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
  
  onLambda(lambda: Lambda): void {
    this.parent = lambda
    this.child = Child.Right

    lambda.body.visit(this)
  }

  onChurchNumber(churchNumber: ChurchNumber): void {
    this.nextReduction = new NextExpansion(this.parent, this.child, churchNumber)
  }

  onMacro(macro: Macro): void {
    this.nextReduction = new NextExpansion(this.parent, this.child, macro)
  }

  onVariable(variable: Variable): void {
    this.nextReduction = new NextNone
  }
}