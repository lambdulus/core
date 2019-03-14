import { AST, Child, Binary } from "../ast";
import { ASTReduction } from ".";

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