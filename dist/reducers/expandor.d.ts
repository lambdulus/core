import { AST } from "../ast";
import { Reductions, ASTVisitor } from "../visitors";
import { ChurchNumber } from "../ast/churchnumber";
import { Macro } from "../ast/macro";
export declare class Expandor extends ASTVisitor {
    tree: AST;
    private expanded;
    private parent;
    private treeSide;
    private target;
    constructor({ parent, treeSide, target }: Reductions.Expansion, tree: AST);
    onChurchNumber(churchNumber: ChurchNumber): void;
    onMacro(macro: Macro): void;
    perform(): void;
}
