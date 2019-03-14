import { AST } from "../ast";
import { BetaReducer } from "./betareducer";
import { AlphaConvertor } from "./alphaconvertor";
import { Expandor } from "./expandor";
import { Reductions } from "../visitors";
import { EmptyReducer } from "./emptyreducer";
import { Reducer } from "../visitors/normalevaluator";

export namespace ReducerFactory {
  export function constructFor (tree : AST, nextReduction : Reductions.ASTReduction) : Reducer {
    if (nextReduction instanceof Reductions.Beta) {
      return new BetaReducer(nextReduction, tree)
    }
    else if (nextReduction instanceof Reductions.Alpha) {
      return new AlphaConvertor(nextReduction, tree)
    }
    else if (nextReduction instanceof Reductions.Expansion) {
      return new Expandor(nextReduction, tree)
    }
    else {
      return new EmptyReducer(tree) // for None
    }
  }
}