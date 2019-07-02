import { Lambda } from "../ast";
import { ASTReduction } from ".";


export class Alpha implements ASTReduction {
  constructor (
    public readonly conversions : Set<Lambda>,
  ) {}
}