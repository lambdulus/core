import { AST } from "../ast";
import { Application } from "../ast/application";
import { Lambda } from "../ast/lambda";
import { ChurchNumber } from "../ast/churchnumber";
import { Macro } from "../ast/macro";
import { Variable } from "../ast/variable";
import { Reductions, ASTVisitor } from ".";
declare class Reducer extends ASTVisitor {
    tree: AST;
    constructor(tree: AST);
    static constructFor(tree: AST, nextReduction: Reductions.ASTReduction): Reducer;
    perform(): void;
}
export declare class AlphaConvertor extends Reducer {
    readonly conversions: Set<Lambda>;
    private converted;
    private oldName;
    private newName;
    constructor({ conversions }: Reductions.Alpha, tree: AST);
    onApplication(application: Application): void;
    onLambda(lambda: Lambda): void;
    onChurchNumber(churchNumber: ChurchNumber): void;
    onMacro(macro: Macro): void;
    onVariable(variable: Variable): void;
    perform(): void;
}
export {};
