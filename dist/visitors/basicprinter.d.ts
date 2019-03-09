import { AST } from "../ast";
import { Application } from "../ast/application";
import { Lambda } from "../ast/lambda";
import { ChurchNumber } from "../ast/churchnumber";
import { Macro } from "../ast/macro";
import { Variable } from "../ast/variable";
import { ASTVisitable, ASTVisitor } from ".";
export declare class BasicPrinter implements ASTVisitor {
    readonly tree: AST & ASTVisitable;
    private expression;
    private printLambdaBody;
    private printLambdaArguments;
    constructor(tree: AST & ASTVisitable);
    print(): string;
    onApplication(application: Application): void;
    onLambda(lambda: Lambda): void;
    onChurchNumber(churchNumber: ChurchNumber): void;
    onMacro(macro: Macro): void;
    onVariable(variable: Variable): void;
}
