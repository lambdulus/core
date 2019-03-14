import { Application, Lambda, ChurchNumber, Macro, Variable } from "../ast";

export abstract class ASTVisitor {
  onApplication (application : Application) : void {}
  onLambda (lambda : Lambda) : void {}
  onChurchNumber (churchNumber : ChurchNumber) : void {}
  onMacro (macro : Macro) : void {}
  onVariable (variable : Variable) : void {}
}