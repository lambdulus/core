import { ASTVisitable } from "../visitors";
export interface Binary extends AST {
    left: AST;
    right: AST;
}
export interface AST extends ASTVisitable {
    identifier: symbol;
    clone(): AST;
}
