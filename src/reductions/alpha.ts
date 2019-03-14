import { Lambda } from "../ast";
import { ASTReduction } from ".";

export class Alpha extends ASTReduction {
  constructor (
    public readonly conversions : Set<Lambda>,
  ) {
    super()
  }
}