import { AST } from "../ast";
import { Application, Lambda, Variable } from "../ast";
import { ASTVisitor } from ".";
export declare class UsedVarNamesFinder extends ASTVisitor {
    private readonly tree;
    used: Set<string>;
    constructor(tree: AST);
    onApplication(application: Application): void;
    onLambda(lambda: Lambda): void;
    onVariable(variable: Variable): void;
}
