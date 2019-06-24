import { Application, Lambda, ChurchNumeral, Macro, Variable } from "../ast";


export abstract class ASTVisitor {
  onApplication (application : Application) : void {}
  onLambda (lambda : Lambda) : void {}
  onChurchNumber (churchNumber : ChurchNumeral) : void {}
  onMacro (macro : Macro) : void {}
  onVariable (variable : Variable) : void {}
}