import { AST, Child, Binary, Application } from "../ast"
import { ASTReduction, ASTReductionType } from "."


export class Eta implements ASTReduction {
  type : ASTReductionType = ASTReductionType.ETA

  constructor (
    public readonly parent : Binary | null,
    public readonly treeSide : Child | null, // na jaky strane pro parenta je redukovanej uzel
    public readonly target : AST, // EXPR ktere po optimalizaci zustane
  ) {}
}