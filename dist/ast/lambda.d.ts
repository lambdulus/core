import { AST, Binary, Variable } from './';
import { ASTVisitor } from '../visitors';
export declare class Lambda extends AST implements Binary {
    argument: Variable;
    body: AST;
    readonly identifier: symbol;
    constructor(argument: Variable, body: AST, identifier?: symbol);
    left: Variable;
    right: AST;
    clone(): Lambda;
    visit(visitor: ASTVisitor): void;
}
