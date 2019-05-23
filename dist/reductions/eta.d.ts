import { AST, Child, Binary } from "../ast";
import { ASTReduction } from ".";
export declare class Eta extends ASTReduction {
    readonly parent: Binary | null;
    readonly treeSide: Child | null;
    readonly target: AST;
    constructor(parent: Binary | null, treeSide: Child | null, // na jaky strane pro parenta je redukovanej uzel
    target: AST);
}
