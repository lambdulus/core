import { Lambda } from "../ast/lambda";
import { Binary, AST, Child } from "../ast";
import { Application } from "../ast/application";
import { ChurchNumber } from "../ast/churchnumber";
import { Variable } from "../ast/variable";
import { Macro } from "../ast/macro";

export namespace Reductions {
  export abstract class ASTReduction {}
  
  export class Alpha extends ASTReduction {
    constructor (
      public readonly conversions : Set<Lambda>,
    ) {
      super()
    }
  }
  
  // TODO: vyresit pro pripady kdy jde o multilambdu
  // pak bude navic drzet mnozinu values a mnozinu arguments
  // spis mnozinu tuples
  export class Beta extends ASTReduction {
    constructor (
      public readonly parent : Binary | null,
      public readonly treeSide : Child | null, // na jaky strane pro parenta je redukovanej uzel
      public readonly target : AST, // EXPR ve kterem se provede nahrada
      public readonly argName : string,
      public readonly value : AST,
    ) {
      super()
    }
  }
  
  export class Expansion extends ASTReduction {
    constructor (
      public readonly parent : Binary | null,
      public readonly treeSide : Child | null,
      public readonly target : AST,
    ) {
      super()
    }
  }
  
  export class None extends ASTReduction {}

}

export abstract class ASTVisitor {
  onApplication (application : Application) : void {}
  onLambda (lambda : Lambda) : void {}
  onChurchNumber (churchNumber : ChurchNumber) : void {}
  onMacro (macro : Macro) : void {}
  onVariable (variable : Variable) : void {}
}