import { AST } from "../ast";
import { AlphaConvertor, BetaReducer, Expandor, EmptyReducer, Reducer } from './'
// import { Reducer } from "../visitors/normalevaluator"
import { ASTReduction, Alpha, Beta, Expansion } from "../reductions";
import { Eta } from "../reductions/eta";
import { EtaConvertor } from "./etaconvertor";


// TODO: implement for AbstractionApplication
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
  else if (nextReduction instanceof Eta) {
    return new EtaConvertor(nextReduction, tree)
  }
  else {
    return new EmptyReducer(tree) // for None
  }
}
