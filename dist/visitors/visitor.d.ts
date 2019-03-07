import { AST, Visitable, NextReduction } from '../parser/parser';
import { Application } from '../parser/ast/application';
import { Lambda } from '../parser/ast/lambda';
import { ChurchNumber } from '../parser/ast/churchnumber';
import { Macro } from '../parser/ast/macro';
import { Variable } from '../parser/ast/variable';
export interface Visitor {
    onApplication(application: Application): void;
    onLambda(lambda: Lambda): void;
    onChurchNumber(churchnumber: ChurchNumber): void;
    onMacro(macro: Macro): void;
    onVariable(variable: Variable): void;
}
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
export declare class NormalEvaluation implements Visitor {
    readonly tree: AST;
    private parent;
    private child;
    nextReduction: NextReduction;
    constructor(tree: AST);
    evaluate(): AST;
    onApplication(application: Application): void;
    onLambda(lambda: Lambda): void;
    onChurchNumber(churchNumber: ChurchNumber): void;
    onMacro(macro: Macro): void;
    onVariable(variable: Variable): void;
}
