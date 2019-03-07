import { ASTVisitor, NextReduction } from ".";
import { AST } from "../parser";
import { Application } from "../parser/ast/application";
import { Variable } from "../parser/ast/variable";
import { Lambda } from "../parser/ast/lambda";
import { ChurchNumber } from "../parser/ast/churchnumber";
import { Macro } from "../parser/ast/macro";
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
