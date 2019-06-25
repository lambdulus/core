import { AST, Application, Lambda, ChurchNumeral, Macro, Variable } from "../ast";
import { ASTVisitor } from ".";
export declare class BasicPrinter extends ASTVisitor {
    readonly tree: AST;
    private expression;
    private printMultilambda;
    constructor(tree: AST);
    print(): string;
    onApplication(application: Application): void;
    onLambda(lambda: Lambda): void;
    onChurchNumeral(churchNumeral: ChurchNumeral): void;
    onMacro(macro: Macro): void;
    onVariable(variable: Variable): void;
}
