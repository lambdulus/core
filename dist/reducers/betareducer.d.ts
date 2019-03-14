import { AST } from "../ast";
import { Application } from "../ast/application";
import { Lambda } from "../ast/lambda";
import { Macro } from "../ast/macro";
import { ChurchNumber } from "../ast/churchnumber";
import { Variable } from "../ast/variable";
import { Reductions, ASTVisitor } from "../visitors";
export declare class BetaReducer extends ASTVisitor {
    private readonly argName;
    private readonly value;
    private substituted;
    tree: AST;
    private parent;
    private treeSide;
    private target;
    constructor({ parent, treeSide, target, argName, value }: Reductions.Beta, tree: AST);
    onApplication(application: Application): void;
    onLambda(lambda: Lambda): void;
    onChurchNumber(churchNumber: ChurchNumber): void;
    onMacro(macro: Macro): void;
    onVariable(variable: Variable): void;
    perform(): void;
}
