import { ReductionVisitor, NextReduction, NextAlpha, NextBeta, NextExpansion, NextNone } from ".";
import { AST } from "../ast";
import { Expandor } from "./expandor";
import { BetaReducer } from "./betareducer";
import { AlphaConvertor } from "./alphaconvertor";

// TODO: zrusit ReductionVisitory
// implementovat materskou tridu, Reduction, od ni budou alfa beta expanze dedit, implementovat
// nejakou metodu perform
// dal uz stejny klidne
export class Reducer implements ReductionVisitor  {
  constructor (
    public tree : AST,
    public readonly nextReduction : NextReduction,
  ) {
    nextReduction.visit(this)
  }

  onAlpha (alpha : NextAlpha) : void {
    const alphaConvertor : AlphaConvertor = new AlphaConvertor(alpha)
  }

  onBeta (beta : NextBeta) : void {
    const betaReducer : BetaReducer = new BetaReducer(beta, this.tree)
    this.tree = betaReducer.tree
  }

  onExpansion (expansion : NextExpansion) : void {
    const expander : Expandor = new Expandor(expansion, this.tree)
    this.tree = expander.tree
  }

  onNone (none : NextNone) : void {
    // nothing
  }
}