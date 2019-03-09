import { ASTVisitor, NextReduction } from ".";
import { AST } from "../ast";
import { Application } from "../ast/application";
import { Variable } from "../ast/variable";
import { Lambda } from "../ast/lambda";
import { ChurchNumber } from "../ast/churchnumber";
import { Macro } from "../ast/macro";
export declare class NormalEvaluator implements ASTVisitor {
    readonly tree: AST;
    private parent;
    private child;
    nextReduction: NextReduction;
    constructor(tree: AST);
    onApplication(application: Application): void;
    onLambda(lambda: Lambda): void;
    onChurchNumber(churchNumber: ChurchNumber): void;
    onMacro(macro: Macro): void;
    onVariable(variable: Variable): void;
}
