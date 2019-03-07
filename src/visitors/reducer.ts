import { ReductionVisitor, NextReduction, NextAlpha, NextBeta, NextExpansion, NextNone, Child } from ".";
import { AST } from "../parser";
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
    // const { tree, child, oldName, newName } = alpha

    const alphaConvertor : AlphaConvertor = new AlphaConvertor(alpha)

    // tree[<Child> child] = tree[<Child> child].alphaConvert(oldName, newName)
  }

  onBeta (beta : NextBeta) : void {
    // const { parent, treeSide, target, argName, value } = beta

    const betaReducer : BetaReducer = new BetaReducer(beta, this.tree)
    this.tree = betaReducer.tree

    // const substituted : AST = target.betaReduce(argName, value)

    // if (parent === null) {
    //   this.tree = substituted
    // }
    // else {
    //   parent[<Child> treeSide] = substituted
    // }
  }

  onExpansion (expansion : NextExpansion) : void {
    // const { parent, treeSide, target } = expansion

    const expander : Expandor = new Expandor(expansion, this.tree)
    this.tree = expander.tree

    // const expanded : AST = target.expand()

    // if (parent === null) {
    //   this.tree = expanded
    // }
    // else {
    //   parent[<Child> treeSide] = expanded
    // }
  }

  onNone (none : NextNone) : void {
    // nothing
  }

  
}