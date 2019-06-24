import { AST, ChurchNumber, Macro } from "../ast";
import { ASTVisitor } from "../visitors";
import { Expansion } from "../reductions";
export declare class Expander extends ASTVisitor {
    tree: AST;
    private expanded;
    private parent;
    private treeSide;
    private target;
    constructor({ parent, treeSide, target }: Expansion, tree: AST);
    churchNumberBody(n: number): AST;
    churchNumberHeader(tree: AST): AST;
    onChurchNumber(churchNumber: ChurchNumber): void;
    onMacro(macro: Macro): void;
    perform(): void;
}
