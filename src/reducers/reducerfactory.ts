import { AST } from "../ast"
import { AlphaConverter, BetaReducer, Expander, EmptyReducer, Reducer } from './'
import { ASTReduction, Alpha, Beta, Expansion, Gama } from "../reductions"
import { Eta } from "../reductions/eta"
import { EtaConverter } from "./etaconverter"
import { GamaReducer } from "./gamareducer"


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
  else if (nextReduction instanceof Gama) {
    if (GamaReducer.assertReduction(nextReduction)) {
      return new GamaReducer(nextReduction, tree)
    }
    else {
      throw new Error(`Invalid arguments of ${nextReduction.abstraction[0]}.`)
    }
  }
  else {
    return new EmptyReducer(tree) // for None
  }
}
