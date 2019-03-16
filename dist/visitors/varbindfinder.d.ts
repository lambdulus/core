import { Application, Lambda, ChurchNumber, Macro, Variable } from "../ast";
import { ASTVisitor } from ".";
export declare class VarBindFinder implements ASTVisitor {
    tree: Lambda;
    varName: string;
    lambda: Lambda | null;
    constructor(tree: Lambda, varName: string);
    onApplication(application: Application): void;
    onLambda(lambda: Lambda): void;
    onChurchNumber(churchNumber: ChurchNumber): void;
    onMacro(macro: Macro): void;
    onVariable(variable: Variable): void;
}
