import { Reductions, ASTVisitor } from "../visitors";
import { AST } from "../ast";
import { Expandor } from "./expandor";
import { BetaReducer } from "./betareducer";
import { AlphaConvertor } from "./alphaconvertor";

export class EmptyReducer extends ASTVisitor {
  constructor (
    public tree : AST,
  ) {
    super()
  }

  // static constructFor (tree : AST, nextReduction : Reductions.ASTReduction) : Reducer {
  //   if (nextReduction instanceof Reductions.Beta) {
  //     return new BetaReducer(nextReduction, tree)
  //   }
  //   else if (nextReduction instanceof Reductions.Alpha) {
  //     return new AlphaConvertor(nextReduction, tree)
  //   }
  //   else if (nextReduction instanceof Reductions.Expansion) {
  //     return new Expandor(nextReduction, tree)
  //   }
  //   else {
  //     // throw new Error('There are no Reduction implementations for type' + nextReduction.toString())
  //     // or
  //     return new Reducer(tree) // for None
  //   }
  // }

  perform () : void {
    // nothing
  }
}