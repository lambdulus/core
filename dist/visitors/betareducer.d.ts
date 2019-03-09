import { AST } from "../ast";
import { Application } from "../ast/application";
import { Lambda } from "../ast/lambda";
import { Macro } from "../ast/macro";
import { ChurchNumber } from "../ast/churchnumber";
import { Variable } from "../ast/variable";
import { ASTVisitor, NextBeta } from ".";
export declare class BetaReducer implements ASTVisitor {
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
