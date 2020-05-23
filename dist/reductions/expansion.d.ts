import { Binary, Child, AST } from "../ast";
import { ASTReduction, ASTReductionType } from ".";
export declare class Expansion implements ASTReduction {
    readonly parent: Binary | null;
    readonly treeSide: Child | null;
    readonly target: AST;
    type: ASTReductionType;
    constructor(parent: Binary | null, treeSide: Child | null, target: AST);
}
