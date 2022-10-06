import { AST } from "../ast";
import { ASTVisitor } from "../visitors";
import { Eta } from "../reductions/eta";
export declare class EtaConverter extends ASTVisitor {
    tree: AST;
    private parent;
    private treeSide;
    private target;
    constructor({ parent, treeSide, target }: Eta, tree: AST);
    perform(): void;
}
