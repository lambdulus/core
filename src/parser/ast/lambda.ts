import { AST, Binary } from '..'
import { Variable } from './variable'
import { Visitor } from '../../visitors/visitor';

export class Lambda implements Binary {
  public readonly identifier : symbol = Symbol()

  constructor (
    public argument : Variable,
    public body : AST
  ) {}

  public get left () {
    return this.argument
  }

  public set left (argument : Variable) {
    this.argument = argument
  }

  public get right () {
    return this.body
  }

  public set right (body : AST) {
    this.body = body
  }

  clone () : Lambda {
    // TODO: consider not clonning
    return new Lambda(this.argument.clone(), this.body.clone())
  }

  visit (visitor : Visitor) : void {
    visitor.onLambda(this)
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
      return this
    }

    // TODO: clone or not clone ? i'd say CLONE but consider not clonning
    return new Lambda(this.argument.clone(), this.body.betaReduce(argName, value))
  }
  
  etaConvert () : AST {
    throw new Error("Method not implemented.");
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
}