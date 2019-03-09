import { ASTVisitor, NextAlpha, SingleAlpha } from ".";
import { Application } from "../parser/ast/application";
import { Lambda } from "../parser/ast/lambda";
import { ChurchNumber } from "../parser/ast/churchnumber";
import { Macro } from "../parser/ast/macro";
import { Variable } from "../parser/ast/variable";
export declare class AlphaConvertor implements ASTVisitor {
    readonly conversions: Array<SingleAlpha>;
    private converted;
    private oldName;
    private newName;
    constructor({ conversions }: NextAlpha);
    onApplication(application: Application): void;
    onLambda(lambda: Lambda): void;
    onChurchNumber(churchNumber: ChurchNumber): void;
    onMacro(macro: Macro): void;
    onVariable(variable: Variable): void;
}
