import { AST } from "../ast";
import { Application, Lambda, Variable } from "../ast";
import { ASTVisitor } from ".";
export declare class FreeVarsFinder extends ASTVisitor {
    private readonly tree;
    private bound;
    freeVars: Set<string>;
    constructor(tree: AST);
    onApplication(application: Application): void;
    onLambda(lambda: Lambda): void;
    onVariable(variable: Variable): void;
}
