import { ASTVisitor } from ".";
import { AST, Application, Lambda, ChurchNumber, Macro, Variable } from "../ast";
import { ASTReduction } from "../reductions";
export interface Reducer {
    tree: AST;
    perform(): void;
}
export declare class NormalEvaluator extends ASTVisitor {
    readonly tree: AST;
    private parent;
    private child;
    nextReduction: ASTReduction;
    reducer: Reducer;
    constructor(tree: AST);
    onApplication(application: Application): void;
    onLambda(lambda: Lambda): void;
    onChurchNumber(churchNumber: ChurchNumber): void;
    onMacro(macro: Macro): void;
    onVariable(variable: Variable): void;
    perform(): AST;
}
