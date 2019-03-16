import { AST, Application, Lambda, ChurchNumber, Macro, Variable } from "../ast";
import { ASTVisitor } from "../visitors";
import { Beta } from "../reductions";
export declare class BetaReducer extends ASTVisitor {
    tree: AST;
    private substituted;
    private parent;
    private treeSide;
    private target;
    private readonly argName;
    private readonly value;
    constructor({ parent, treeSide, target, argName, value }: Beta, tree: AST);
    onApplication(application: Application): void;
    onLambda(lambda: Lambda): void;
    onChurchNumber(churchNumber: ChurchNumber): void;
    onMacro(macro: Macro): void;
    onVariable(variable: Variable): void;
    perform(): void;
}
