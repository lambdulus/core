import { ASTVisitor } from ".";
import { AST, Application, Lambda, ChurchNumeral, Macro, Variable } from "../ast";
import { Reducer } from "../reducers";
import { ASTReduction } from "../reductions";
export declare class NormalEvaluator extends ASTVisitor {
    readonly tree: AST;
    private parent;
    private child;
    nextReduction: ASTReduction;
    reducer: Reducer;
    constructor(tree: AST);
    onApplication(application: Application): void;
    onLambda(lambda: Lambda): void;
    onChurchNumber(churchNumber: ChurchNumeral): void;
    onMacro(macro: Macro): void;
    onVariable(variable: Variable): void;
    perform(): AST;
}
