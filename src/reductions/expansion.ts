import { Binary, Child, AST } from "../ast";
import { ASTReduction } from ".";


export class Expansion extends ASTReduction {
  constructor (
    public readonly parent : Binary | null,
    public readonly treeSide : Child | null,
    public readonly target : AST,
  ) {
    super()
  }
}