import { AST, Binary } from './';
import { Variable } from './variable';
import { ASTVisitor } from '../visitors';
export declare class Lambda implements AST, Binary {
    argument: Variable;
    body: AST;
    readonly identifier: symbol;
    constructor(argument: Variable, body: AST);
    left: Variable;
    right: AST;
    clone(): Lambda;
    visit(visitor: ASTVisitor): void;
}
