import { ASTVisitor } from ".";
import { Lambda } from "../ast/lambda";
import { Application } from "../ast/application";
import { Variable } from "../ast/variable";
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
