import { AST } from "../ast";
import { Application } from "../ast/application";
import { Lambda } from "../ast/lambda";
import { Macro } from "../ast/macro";
import { ChurchNumber } from "../ast/churchnumber";
import { Variable } from "../ast/variable";
import { ASTVisitor } from ".";
export declare class FreeVarsFinder implements ASTVisitor {
    private readonly tree;
    private bound;
    freeVars: Set<string>;
    constructor(tree: AST);
    onApplication(application: Application): void;
    onLambda(lambda: Lambda): void;
    onChurchNumber(churchNumber: ChurchNumber): void;
    onMacro(macro: Macro): void;
    onVariable(variable: Variable): void;
}
