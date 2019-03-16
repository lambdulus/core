import { Binary, Child, AST } from "../ast";
import { ASTReduction } from ".";
export declare class Expansion extends ASTReduction {
    readonly parent: Binary | null;
    readonly treeSide: Child | null;
    readonly target: AST;
    constructor(parent: Binary | null, treeSide: Child | null, target: AST);
}
