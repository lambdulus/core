import { Macro } from "../parser/ast/macro";
import { ChurchNumber } from "../parser/ast/churchnumber";
import { Variable } from "../parser/ast/variable";
import { Lambda } from "../parser/ast/lambda";
import { Application } from "../parser/ast/application";
import { Visitable, Visitor } from "./visitor";
import { AST } from "../parser";
export declare class BasicPrinter implements Visitor {
    readonly tree: AST & Visitable;
    private expression;
    private printLambdaBody;
    private printLambdaArguments;
    constructor(tree: AST & Visitable);
    print(): string;
    onApplication(application: Application): void;
    onLambda(lambda: Lambda): void;
    onChurchNumber(churchNumber: ChurchNumber): void;
    onMacro(macro: Macro): void;
    onVariable(variable: Variable): void;
}
