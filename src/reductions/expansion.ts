import { Binary, Child, AST } from "../ast"
import { ASTReduction, ASTReductionType } from "."


export class Expansion implements ASTReduction {
  type : ASTReductionType = ASTReductionType.EXPANSION

  constructor (
    public readonly parent : Binary | null,
    public readonly treeSide : Child | null,
    public readonly target : AST,
  ) {}
}