import { ASTVisitor, NextAlpha } from ".";
import { Application } from "../parser/ast/application";
import { Lambda } from "../parser/ast/lambda";
import { ChurchNumber } from "../parser/ast/churchnumber";
import { Macro } from "../parser/ast/macro";
import { Variable } from "../parser/ast/variable";
import { AST } from "../parser";
export declare class AlphaConvertor implements ASTVisitor {
    readonly tree: AST;
    private readonly child;
    private readonly oldName;
    private readonly newName;
    private converted;
    constructor({ tree, child, oldName, newName }: NextAlpha);
    onApplication(application: Application): void;
    onLambda(lambda: Lambda): void;
    onChurchNumber(churchNumber: ChurchNumber): void;
    onMacro(macro: Macro): void;
    onVariable(variable: Variable): void;
}
