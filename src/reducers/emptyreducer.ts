import { ASTVisitor } from "../visitors";
import { AST } from "../ast";


export class EmptyReducer extends ASTVisitor {
  constructor (
    public tree : AST,
  ) {
    super()
  }

  perform () : void {
    // nothing
  }
}