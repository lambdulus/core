import { Application } from "../ast/application";
import { Lambda } from "../ast/lambda";
import { ChurchNumber } from "../ast/churchnumber";
import { Macro } from "../ast/macro";
import { Variable } from "../ast/variable";
import { ASTVisitor, NextAlpha, SingleAlpha } from ".";
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
