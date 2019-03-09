import { ASTVisitor } from ".";
import { Application } from "../parser/ast/application";
import { Lambda } from "../parser/ast/lambda";
import { ChurchNumber } from "../parser/ast/churchnumber";
import { Macro } from "../parser/ast/macro";
import { Variable } from "../parser/ast/variable";
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
