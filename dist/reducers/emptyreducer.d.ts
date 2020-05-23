import { ASTVisitor } from "../visitors";
import { AST } from "../ast";
export declare class EmptyReducer extends ASTVisitor {
    tree: AST;
    constructor(tree: AST);
    perform(): void;
}
