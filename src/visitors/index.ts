import { Lambda } from "../ast/lambda";
import { Application } from "../ast/application";
import { ChurchNumber } from "../ast/churchnumber";
import { Variable } from "../ast/variable";
import { Macro } from "../ast/macro";

export abstract class ASTVisitor {
  onApplication (application : Application) : void {}
  onLambda (lambda : Lambda) : void {}
  onChurchNumber (churchNumber : ChurchNumber) : void {}
  onMacro (macro : Macro) : void {}
  onVariable (variable : Variable) : void {}
}