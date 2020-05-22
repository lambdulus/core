import { ASTVisitor } from "../visitors";
export declare enum Child {
    Left = "left",
    Right = "right"
}
export interface Binary extends AST {
    left: AST;
    right: AST;
}
export declare abstract class AST {
    abstract type: string;
    abstract identifier: symbol;
    abstract clone(): AST;
    abstract visit(visitor: ASTVisitor): void;
    toString(): string;
}
