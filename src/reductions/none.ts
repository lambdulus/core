import { ASTReduction, ASTReductionType } from "."


export class None implements ASTReduction {
  type : ASTReductionType = ASTReductionType.NONE
}