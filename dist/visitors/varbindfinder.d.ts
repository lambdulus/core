import { Application } from "../ast/application";
import { Lambda } from "../ast/lambda";
import { Macro } from "../ast/macro";
import { ChurchNumber } from "../ast/churchnumber";
import { Variable } from "../ast/variable";
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
