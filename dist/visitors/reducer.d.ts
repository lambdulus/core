import { ReductionVisitor, NextReduction, NextAlpha, NextBeta, NextExpansion, NextNone } from ".";
import { AST } from "../ast";
export declare class Reducer implements ReductionVisitor {
    tree: AST;
    readonly nextReduction: NextReduction;
    constructor(tree: AST, nextReduction: NextReduction);
    onAlpha(alpha: NextAlpha): void;
    onBeta(beta: NextBeta): void;
    onExpansion(expansion: NextExpansion): void;
    onNone(none: NextNone): void;
}
