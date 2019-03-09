import { ReductionVisitor, NextReduction, NextAlpha, NextBeta, NextExpansion, NextNone } from ".";
import { AST } from "../ast";
import { Expandor } from "./expandor";
import { BetaReducer } from "./betareducer";
import { AlphaConvertor } from "./alphaconvertor";


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