import { ASTVisitor } from "../visitors";
import { AST, Application, Lambda, ChurchNumeral, Macro, Variable } from "../ast";
import { Reducer } from "../reducers";
import { ASTReduction } from "../reductions";
export declare class SimplifiedNormalEvaluator extends ASTVisitor {
    readonly tree: AST;
    private originalParent;
    private parent;
    private child;
    private originalReduction;
    nextReduction: ASTReduction;
    reducer: Reducer;
    constructor(tree: AST);
    onApplication(application: Application): void;
    onLambda(lambda: Lambda): void;
    onChurchNumeral(churchNumeral: ChurchNumeral): void;
    onMacro(macro: Macro): void;
    onVariable(variable: Variable): void;
    perform(): AST;
}
