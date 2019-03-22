import { AST, ChurchNumber, Macro } from "../ast";
import { ASTVisitor } from "../visitors";
import { Expansion } from "../reductions";
export declare class Expandor extends ASTVisitor {
    tree: AST;
    private expanded;
    private parent;
    private treeSide;
    private target;
    constructor({ parent, treeSide, target }: Expansion, tree: AST);
    recursiveApplication(n: number): AST;
    churchNumber(tree: AST): AST;
    onChurchNumber(churchNumber: ChurchNumber): void;
    onMacro(macro: Macro): void;
    perform(): void;
}
