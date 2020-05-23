import { Lambda } from "../ast"
import { ASTReduction, ASTReductionType } from "."


export class Alpha implements ASTReduction {
  type : ASTReductionType = ASTReductionType.ALPHA

  constructor (
    public readonly conversions : Set<Lambda>,
  ) {}
}