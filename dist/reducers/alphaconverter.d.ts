import { AST, Application, Lambda, ChurchNumber, Macro, Variable } from "../ast";
import { ASTVisitor } from "../visitors";
import { Alpha } from "../reductions";
export declare class AlphaConverter extends ASTVisitor {
    tree: AST;
    private converted;
    private oldName;
    private newName;
    readonly conversions: Set<Lambda>;
    constructor({ conversions }: Alpha, tree: AST);
    onApplication(application: Application): void;
    onLambda(lambda: Lambda): void;
    onChurchNumber(churchNumber: ChurchNumber): void;
    onMacro(macro: Macro): void;
    onVariable(variable: Variable): void;
    perform(): void;
}
