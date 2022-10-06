import { AST, Child, Binary } from "../ast";
import { ASTReduction, ASTReductionType } from ".";
export declare class Eta implements ASTReduction {
    readonly parent: Binary | null;
    readonly treeSide: Child | null;
    readonly target: AST;
    type: ASTReductionType;
    constructor(parent: Binary | null, treeSide: Child | null, // na jaky strane pro parenta je redukovanej uzel
    target: AST);
}
