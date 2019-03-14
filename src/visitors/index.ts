import { Lambda } from "../ast/lambda";
import { Binary, AST } from "../ast";
import { Application } from "../ast/application";
import { ChurchNumber } from "../ast/churchnumber";
import { Variable } from "../ast/variable";
import { Macro } from "../ast/macro";
// import { Reducer } from "./reducer";

export enum Child {
  Left = 'left',
  Right = 'right',
}

export namespace Reductions {
  export abstract class ASTReduction {}
  
  export class Alpha extends ASTReduction {
    constructor (
      public readonly conversions : Set<Lambda>,
    ) {
      super()
    }
  
    // public visit (visitor : ReductionVisitor) : void {
    //   visitor.onAlpha(this)
    // }
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


    // visit (visitor : ReductionVisitor) : void {
    //   visitor.onBeta(this)
    // }
  }
  
  
  export class Expansion extends ASTReduction {
    constructor (
      public readonly parent : Binary | null,
      public readonly treeSide : Child | null,
      public readonly target : AST,
    ) {
      super()
    }
  
    // visit (visitor : ReductionVisitor) : void {
    //   visitor.onExpansion(this)
    // }
  }
  
  export class None extends ASTReduction {}

}


// TODO: tohle klidne zrusit, rovnou interface AST tridy budou implementovat visit()
export interface ASTVisitable {
  visit (visitor : ASTVisitor) : void,
}
// TODO: tady to same
// export interface ReductionVisitable {
//   visit (visitor : ReductionVisitor) : void,
// }


export abstract class ASTVisitor {
  onApplication (application : Application) : void {}
  onLambda (lambda : Lambda) : void {}
  onChurchNumber (churchNumber : ChurchNumber) : void {}
  onMacro (macro : Macro) : void {}
  onVariable (variable : Variable) : void {}
}

// TODO: tohle jako materskou tridu, rovnou implementuje vsechny metody jako prazdny,
// pak nemusim mit konkretni tridy prazdny
// export interface ReductionVisitor {
//   onAlpha (alpha : NextAlpha) : void,
//   onBeta (beta : NextBeta) : void,
//   onExpansion (expansion : NextExpansion) : void,
//   onNone (none : NextNone) : void,
// }
