import { Lambda } from "../ast/lambda";
import { ASTReduction } from ".";

export class Alpha extends ASTReduction {
  constructor (
    public readonly conversions : Set<Lambda>,
  ) {
    super()
  }
}