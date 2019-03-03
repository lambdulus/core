import { AST, ReductionResult, NextReduction, Child } from '../parser'
import { Variable } from './variable'

export class Lambda implements AST {
  public readonly identifier : symbol = Symbol()

  constructor (
    public argument : Variable,
    public body : AST
  ) {}

  clone () : Lambda {
    return new Lambda(this.argument, this.body)
  }

  nextNormal (parent : AST | null, child : Child | null) : NextReduction {
    return this.body.nextNormal(this, Child.Right)
  }

  reduceNormal () : ReductionResult {
    const { tree, reduced, reduction, currentSubtree } : ReductionResult = this.body.reduceNormal()
    this.body = tree

    return { tree : this, reduced, reduction, currentSubtree }
  }

  reduceApplicative () : ReductionResult {
    throw new Error("Method not implemented.");
  }
  
  alphaConvert (oldName : string, newName : string) : AST {
    const left : Variable = this.argument.alphaConvert(oldName, newName)
    const right : AST = this.body.alphaConvert(oldName, newName)

    this.argument = left
    this.body = right

    return this
  }
  
  betaReduce (argName : string, value : AST) : AST {
    if (this.argument.name() === argName) {
      return this // TODO: should I create new one? probably
    }

    return new Lambda(this.argument.clone(), this.body.betaReduce(argName, value))
  }
  
  etaConvert () : AST {
    throw new Error("Method not implemented.");
  }

  print () : string {
    if (this.body instanceof Lambda) {
      return `(λ ${ this.printLambdaArguments(this.argument.name()) } . ${ this.printLambdaBody() })`
    }
    return `(λ ${ this.argument.print() } . ${ this.body.print() })`
  }

  freeVarName (bound : Array<string>) : string | null {
    return this.body.freeVarName([ ...bound, this.argument.name()])
  }

  isBound (varName : string) : boolean {
    if (this.argument.name() === varName) {
      return true
    }

    if (this.body instanceof Lambda) {
      return this.body.isBound(varName)
    }

    return false
  }

  printLambdaArguments (accumulator : string) : string {
    if (this.body instanceof Lambda) {
      return this.body.printLambdaArguments(`${ accumulator } ${ this.body.argument.name() }`)
    }
    
    return accumulator
  }

  printLambdaBody () : string {
    if (this.body instanceof Lambda) {
      return this.body.printLambdaBody()
    }

    return this.body.print()
  }
}