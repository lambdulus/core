import { ASTVisitor, Reductions } from ".";
import { AST } from "../ast";
import { Application } from "../ast/application";
import { Variable } from "../ast/variable";
import { Lambda } from "../ast/lambda";
import { ChurchNumber } from "../ast/churchnumber";
import { Macro } from "../ast/macro";
export interface Reducer {
    tree: AST;
    perform(): void;
}
export declare class NormalEvaluator extends ASTVisitor {
    readonly tree: AST;
    private parent;
    private child;
    nextReduction: Reductions.ASTReduction;
    reducer: Reducer;
    constructor(tree: AST);
    onApplication(application: Application): void;
    onLambda(lambda: Lambda): void;
    onChurchNumber(churchNumber: ChurchNumber): void;
    onMacro(macro: Macro): void;
    onVariable(variable: Variable): void;
    perform(): AST;
}
