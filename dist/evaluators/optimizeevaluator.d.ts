import { ASTVisitor } from "../visitors";
import { AST, Application, Lambda } from "../ast";
import { Reducer } from "../reducers";
import { ASTReduction } from "../reductions";
export declare class OptimizeEvaluator extends ASTVisitor {
    readonly tree: AST;
    private parent;
    private child;
    nextReduction: ASTReduction;
    reducer: Reducer;
    constructor(tree: AST);
    onApplication(application: Application): void;
    onLambda(lambda: Lambda): void;
    perform(): AST;
}
