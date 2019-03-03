import { AST, ReductionResult, Reduction, NextReduction, Child, NextAlpha, NextBeta } from '../parser'
import { Variable } from './variable'
import { Lambda } from './lambda'

export class Application implements AST {
  public readonly identifier : symbol = Symbol()

  constructor (
    public left : AST,
    public right : AST,
  ) {}

  clone () : Application {
    return new Application(this.left.clone(), this.right.clone())
  }

  nextNormal (parent : AST | null, child : Child) : NextReduction {
    if (this.left instanceof Variable) {
      return this.right.nextNormal(this, Child.Right)
    }

    else if (this.left instanceof Lambda) {
      const freeVar : string | null = this.right.freeVarName([])

      if (freeVar && this.left.isBound(freeVar) && this.left.argument.name() !== freeVar) {
        // TODO: refactor condition PLS it looks awful
        // second third mainly
        // TODO: find truly original non conflicting new name probably using number postfixes
        return new NextAlpha(this, Child.Left, freeVar, `_${ freeVar }`)
      }
      // search for free Vars in right which are bound in left OK
      // if any, do α conversion and return

      // if none, do β reduction and return
      return new NextBeta(parent, child, this.left.body, this.left.argument.name(), this.right)
    }

    else { // (this.left instanceof Macro || this.left instanceof ChurchNumber)
      return this.left.nextNormal(this, Child.Left)
    }
  }

  reduceNormal () : ReductionResult {
    if (this.left instanceof Variable) {
      const { tree, reduced, reduction, currentSubtree } : ReductionResult = this.right.reduceNormal()

      this.right = tree

      return { tree : this, reduced, reduction, currentSubtree }
    }

    else if (this.left instanceof Lambda) {
      const freeVar : string | null = this.right.freeVarName([])

      if (freeVar && this.left.isBound(freeVar) && this.left.argument.name() !== freeVar) {
        // TODO: refactor condition PLS it looks awful
        // second third mainly
        // TODO: find truly original non conflicting new name probably using number postfixes
        const left : AST = this.left.alphaConvert(freeVar, `_${freeVar}`)
        // const tree : AST = new Application(left, this.right)

        this.left = left

        // TODO: decide which node is currentsubstree if α is issued: this or this.left
        return { tree : this, reduced : true, reduction : Reduction.Alpha, currentSubtree : this }
      }
      // search for free Vars in right which are bound in left OK
      // if any, do α conversion and return

      // if none, do β reduction and return
      const name : string = this.left.argument.name()
      const substituent : AST = this.right
      const tree : AST = this.left.body.betaReduce(name, substituent)

      return { tree, reduced : true, reduction : Reduction.Beta, currentSubtree : tree } // currentSubtree
    }

    else { // (this.left instanceof Macro || this.left instanceof ChurchNumber)
      const { tree, reduced, reduction, currentSubtree } : ReductionResult = this.left.reduceNormal()
      this.left = tree

      return { tree : this, reduced, reduction, currentSubtree }
    }
  }

  reduceApplicative () : ReductionResult {
    throw new Error("Method not implemented.");
  }
  
  alphaConvert (oldName : string, newName : string) : AST {
    const left : AST = this.left.alphaConvert(oldName, newName)
    const right : AST = this.right.alphaConvert(oldName, newName)

    return new Application(left, right)
  }
  
  betaReduce (argName : string, value : AST) : AST {
    const left : AST = this.left.betaReduce(argName, value)
    const right : AST = this.right.betaReduce(argName, value)

    return new Application(left, right)
  }
  
  etaConvert () : AST {
    throw new Error("Method not implemented.");
  }

  print () : string {
    if (this.right instanceof Application) {
      return `${ this.left.print() } (${ this.right.print() })`
    }
    return `${ this.left.print() } ${ this.right.print() }`
  }

  freeVarName (bound : Array<string>) : string | null {
    return this.left.freeVarName(bound) || this.right.freeVarName(bound)
  }
}