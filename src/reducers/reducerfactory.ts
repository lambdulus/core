import { AST } from "../ast";
import { AlphaConverter, BetaReducer, Expander, EmptyReducer, Reducer } from './'
// import { Reducer } from "../visitors/normalevaluator"
import { ASTReduction, Alpha, Beta, Expansion } from "../reductions";
import { Eta } from "../reductions/eta";
import { EtaConverter } from "./etaconverter";


// TODO: implement for AbstractionApplication
export function constructFor (tree : AST, nextReduction : ASTReduction) : Reducer {
  if (nextReduction instanceof Beta) {
    return new BetaReducer(nextReduction, tree)
  }
  else if (nextReduction instanceof Alpha) {
    return new AlphaConverter(nextReduction, tree)
  }
  else if (nextReduction instanceof Expansion) {
    return new Expander(nextReduction, tree)
  }
  else if (nextReduction instanceof Eta) {
    return new EtaConverter(nextReduction, tree)
  }
  else {
    return new EmptyReducer(tree) // for None
  }
}
