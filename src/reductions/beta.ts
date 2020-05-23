import { AST, Child, Binary, Application } from "../ast"
import { ASTReduction, ASTReductionType } from "."


// TODO: vyresit pro pripady kdy jde o multilambdu
// pak bude navic drzet mnozinu values a mnozinu arguments
// spis mnozinu tuples
// mozna ani vicekrokovou Betu delat nikdy nebudu
export class Beta implements ASTReduction {
  type : ASTReductionType = ASTReductionType.BETA

  constructor (
    public readonly redex : Application,
    public readonly parent : Binary | null,
    public readonly treeSide : Child | null, // na jaky strane pro parenta je redukovanej uzel
    public readonly target : AST, // EXPR ve kterem se provede nahrada
    public readonly argName : string,
    public readonly value : AST,
  ) {}
}