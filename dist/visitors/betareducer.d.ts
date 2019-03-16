import { AST } from "../ast";
import { Application } from "../ast/application";
import { Lambda } from "../ast/lambda";
import { Macro } from "../ast/macro";
import { ChurchNumber } from "../ast/churchnumber";
import { Variable } from "../ast/variable";
import { Reductions, ASTVisitor } from ".";
declare class Reducer extends ASTVisitor {
    tree: AST;
    constructor(tree: AST);
    static constructFor(tree: AST, nextReduction: Reductions.ASTReduction): Reducer;
    perform(): void;
}
export declare class BetaReducer extends Reducer {
    private readonly argName;
    private readonly value;
    private substituted;
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
export {};
