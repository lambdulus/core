import { ASTVisitor, NextExpansion } from ".";
import { ChurchNumber } from "../parser/ast/churchnumber";
import { Application } from "../parser/ast/application";
import { Lambda } from "../parser/ast/lambda";
import { Macro } from "../parser/ast/macro";
import { Variable } from "../parser/ast/variable";
import { AST } from "../parser";
export declare class Expandor implements ASTVisitor {
    private readonly parent;
    private readonly treeSide;
    private readonly target;
    private expanded;
    tree: AST;
    constructor({ parent, treeSide, target }: NextExpansion, tree: AST);
    onApplication(application: Application): void;
    onLambda(lambda: Lambda): void;
    onChurchNumber(churchNumber: ChurchNumber): void;
    onMacro(macro: Macro): void;
    onVariable(variable: Variable): void;
}
