import { AST, Child, Binary, Application } from "../ast";
import { ASTReduction, ASTReductionType } from ".";
export declare class Beta implements ASTReduction {
    readonly redex: Application;
    readonly parent: Binary | null;
    readonly treeSide: Child | null;
    readonly target: AST;
    readonly argName: string;
    readonly value: AST;
    type: ASTReductionType;
    constructor(redex: Application, parent: Binary | null, treeSide: Child | null, // na jaky strane pro parenta je redukovanej uzel
    target: AST, // EXPR ve kterem se provede nahrada
    argName: string, value: AST);
}
