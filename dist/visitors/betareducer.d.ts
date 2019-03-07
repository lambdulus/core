import { ASTVisitor, NextBeta } from ".";
import { ChurchNumber } from "../parser/ast/churchnumber";
import { Application } from "../parser/ast/application";
import { Lambda } from "../parser/ast/lambda";
import { Macro } from "../parser/ast/macro";
import { Variable } from "../parser/ast/variable";
import { AST } from "../parser";
export declare class BetaReducer implements ASTVisitor {
    private readonly parent;
    private readonly treeSide;
    private readonly target;
    private readonly argName;
    private readonly value;
    private substituted;
    tree: AST;
    constructor({ parent, treeSide, target, argName, value }: NextBeta, tree: AST);
    onApplication(application: Application): void;
    onLambda(lambda: Lambda): void;
    onChurchNumber(churchNumber: ChurchNumber): void;
    onMacro(macro: Macro): void;
    onVariable(variable: Variable): void;
}
