import { AST, Application, Lambda, ChurchNumeral, Macro, Variable } from "../ast";
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
    onChurchNumeral(churchNumeral: ChurchNumeral): void;
    onMacro(macro: Macro): void;
    onVariable(variable: Variable): void;
    perform(): void;
    createUniqueName(original: string, usedNames: Set<string>): string;
}
