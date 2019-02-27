import { AST, ReductionResult, Reduction } from '../parser'
import { Variable } from './variable'
import { Lambda } from './lambda'

export class Application implements AST {
  constructor (
    public readonly lambda : AST,
    public readonly argument : AST,
  ) {}

  clone () : Application {
    return new Application(this.lambda.clone(), this.argument.clone())
  }

  reduceNormal () : ReductionResult {
    if (this.lambda instanceof Variable) {
      const { tree : left, reduced, reduction, currentSubtree } : ReductionResult = this.argument.reduceNormal()
      const tree : AST = new Application(this.lambda.clone(), left)

      return { tree, reduced, reduction, currentSubtree }
    }

    else if (this.lambda instanceof Lambda) {
      const freeVar : string | null = this.argument.freeVarName([])

      if (freeVar && this.lambda.isBound(freeVar)) {
        // TODO: find truly original non conflicting new name probably using number postfixes
        const left : AST = this.lambda.alphaConvert(freeVar, `_${freeVar}`)
        const tree : AST = new Application(left, this.argument)

        // TODO: decide which node is currentsubstree if α is issued: this or this.lambda
        return { tree, reduced : true, reduction : Reduction.alpha, currentSubtree : tree }
      }
      // search for free Vars in right which are bound in left OK
      // if any, do α conversion and return

      // if none, do β reduction and return
      const name : string = this.lambda.argument.name()
      const substituent : AST = this.argument
      const tree : AST = this.lambda.body.betaReduce(name, substituent)

      return { tree, reduced : true, reduction : Reduction.beta, currentSubtree : tree } // currentSubtree
    }

    else { // (this.lambda instanceof Macro || this.lambda instanceof ChurchNumber)
      const { tree : right, reduced, reduction, currentSubtree } : ReductionResult = this.lambda.reduceNormal()
      const tree : AST = new Application(right, this.argument.clone())

      return { tree, reduced, reduction, currentSubtree }
    }
  }

  reduceApplicative () : ReductionResult {
    throw new Error("Method not implemented.");
  }
  
  alphaConvert (oldName : string, newName : string) : AST {
    const left : AST = this.lambda.alphaConvert(oldName, newName)
    const right : AST = this.argument.alphaConvert(oldName, newName)

    return new Application(left, right)
  }
  
  betaReduce (argName : string, value : AST) : AST {
    const left : AST = this.lambda.betaReduce(argName, value)
    const right : AST = this.argument.betaReduce(argName, value)

    return new Application(left, right)
  }
  
  etaConvert () : AST {
    throw new Error("Method not implemented.");
  }

  print () : string {
    if (this.argument instanceof Application) {
      return `${ this.lambda.print() } (${ this.argument.print() })`
    }
    return `${ this.lambda.print() } ${ this.argument.print() }`
  }

  freeVarName (bound : Array<string>) : string | null {
    return this.lambda.freeVarName(bound) || this.argument.freeVarName(bound)
  }
}