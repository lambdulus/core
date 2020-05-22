import { Application, Lambda } from "../ast"
import { ASTVisitor } from "."


// TODO: mozna vubec nebude potreba -> DELETE
export class VarBindFinder extends ASTVisitor {
  public lambda : Lambda | null = null

  constructor (
    public tree : Lambda,
    public varName : string,
  ) {
    super()
    tree.visit(this)
  }

  onApplication(application : Application) : void {
    // nothing  
  }
  
  onLambda(lambda : Lambda) : void {
    if (lambda.argument.name() === this.varName) {
      this.lambda = lambda
    }
    else if (lambda.body instanceof Lambda) {
      lambda.body.visit(this)
    }
  }
}