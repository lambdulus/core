import { AST, Binary } from '..'
import { ASTVisitor } from '../../visitors'

// TODO: remove Binary cause not needed 
export class Application implements AST, Binary {
  public readonly identifier : symbol = Symbol()

  constructor (
    public left : AST,
    public right : AST,
  ) {}

  clone () : Application {
    return new Application(this.left.clone(), this.right.clone())
  }

  visit (visitor : ASTVisitor) : void {
    return visitor.onApplication(this)
  }
  
  // alphaConvert (oldName : string, newName : string) : AST {
  //   const left : AST = this.left.alphaConvert(oldName, newName)
  //   const right : AST = this.right.alphaConvert(oldName, newName)

  //   return new Application(left, right)
  // }
  
  // betaReduce (argName : string, value : AST) : AST {
  //   const left : AST = this.left.betaReduce(argName, value)
  //   const right : AST = this.right.betaReduce(argName, value)

  //   return new Application(left, right)
  // }
  
  // etaConvert () : AST {
  //   throw new Error("Method not implemented.");
  // }

  freeVarName (bound : Array<string>) : string | null {
    return this.left.freeVarName(bound) || this.right.freeVarName(bound)
  }
}