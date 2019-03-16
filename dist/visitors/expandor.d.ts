import { AST } from "../ast";
import { Reductions, ASTVisitor } from ".";
import { ChurchNumber } from "../ast/churchnumber";
import { Macro } from "../ast/macro";
declare class Reducer extends ASTVisitor {
    tree: AST;
    constructor(tree: AST);
    static constructFor(tree: AST, nextReduction: Reductions.ASTReduction): Reducer;
    perform(): void;
}
export declare class Expandor extends Reducer {
    private expanded;
    private parent;
    private treeSide;
    private target;
    constructor({ parent, treeSide, target }: Reductions.Expansion, tree: AST);
    onChurchNumber(churchNumber: ChurchNumber): void;
    onMacro(macro: Macro): void;
    perform(): void;
}
export {};
