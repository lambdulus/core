import { Application, Lambda, ChurchNumber, Macro, Variable } from "../ast";
import { ASTVisitor } from ".";

// TODO: mozna vubec nebude potreba -> DELETE
export class VarBindFinder implements ASTVisitor {
  public lambda : Lambda | null = null

  constructor (
    public tree : Lambda,
    public varName : string,
  ) {
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

  onChurchNumber(churchNumber : ChurchNumber) : void {
    // nothing
  }

  onMacro(macro : Macro) : void {
    // nothing
  }

  onVariable(variable : Variable) : void {
    // nothing
  }
}