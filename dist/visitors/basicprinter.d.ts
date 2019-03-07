import { Macro } from "../parser/ast/macro";
import { ChurchNumber } from "../parser/ast/churchnumber";
import { Variable } from "../parser/ast/variable";
import { Lambda } from "../parser/ast/lambda";
import { Application } from "../parser/ast/application";
import { ASTVisitable, ASTVisitor } from ".";
import { AST } from "../parser";
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
