import { ASTVisitor } from ".";
import { Application, Lambda, Variable } from "../ast/";
export declare class BoundingFinder extends ASTVisitor {
    tree: Lambda;
    freeVars: Set<string>;
    lambdas: Set<Lambda>;
    private argName;
    private unboundVars;
    constructor(tree: Lambda, freeVars: Set<string>);
    onApplication(application: Application): void;
    onLambda(lambda: Lambda): void;
    onVariable(variable: Variable): void;
}
