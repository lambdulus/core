import { AST, ChurchNumeral, Macro } from "../ast";
import { ASTVisitor } from "../visitors";
import { Expansion } from "../reductions";
export declare class Expander extends ASTVisitor {
    tree: AST;
    private expanded;
    private parent;
    private treeSide;
    private target;
    constructor({ parent, treeSide, target }: Expansion, tree: AST);
    onChurchNumeralBody(n: number): AST;
    onChurchNumeralHeader(tree: AST): AST;
    onChurchNumeral(churchNumeral: ChurchNumeral): void;
    onMacro(macro: Macro): void;
    perform(): void;
}
