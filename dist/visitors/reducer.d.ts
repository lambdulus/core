import { Reductions, ASTVisitor } from ".";
import { AST } from "../ast";
export default class Reducer extends ASTVisitor {
    tree: AST;
    constructor(tree: AST);
    static constructFor(tree: AST, nextReduction: Reductions.ASTReduction): Reducer;
    perform(): void;
}
