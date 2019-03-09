import { AST } from "../ast";
import { ASTVisitor, NextExpansion } from ".";
import { Application } from "../ast/application";
import { Lambda } from "../ast/lambda";
import { ChurchNumber } from "../ast/churchnumber";
import { Macro } from "../ast/macro";
import { Variable } from "../ast/variable";
export declare class Expandor implements ASTVisitor {
    private expanded;
    tree: AST;
    constructor({ parent, treeSide, target }: NextExpansion, tree: AST);
    onApplication(application: Application): void;
    onLambda(lambda: Lambda): void;
    onChurchNumber(churchNumber: ChurchNumber): void;
    onMacro(macro: Macro): void;
    onVariable(variable: Variable): void;
}
