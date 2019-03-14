import { AST } from "../ast";
import { Application } from "../ast/application";
import { Lambda } from "../ast/lambda";
import { Variable } from "../ast/variable";
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
