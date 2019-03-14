import { AST } from "../ast";
import { BetaReducer } from "./betareducer";
import { AlphaConvertor } from "./alphaconvertor";
import { Expandor } from "./expandor";
import { EmptyReducer } from "./emptyreducer";
import { Reducer } from "../visitors/normalevaluator";
import { Beta } from "../reductions/beta";
import { ASTReduction } from "../reductions";
import { Alpha } from "../reductions/alpha";
import { Expansion } from "../reductions/expansion";

export namespace ReducerFactory {
  export function constructFor (tree : AST, nextReduction : ASTReduction) : Reducer {
    if (nextReduction instanceof Beta) {
      return new BetaReducer(nextReduction, tree)
    }
    else if (nextReduction instanceof Alpha) {
      return new AlphaConvertor(nextReduction, tree)
    }
    else if (nextReduction instanceof Expansion) {
      return new Expandor(nextReduction, tree)
    }
    else {
      return new EmptyReducer(tree) // for None
    }
  }
}