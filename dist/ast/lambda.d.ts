import { AST, Binary, Variable } from './';
import { ASTVisitor } from '../visitors';
export declare class Lambda extends AST implements Binary {
    argument: Variable;
    body: AST;
    readonly identifier: symbol;
    type: string;
    constructor(argument: Variable, body: AST, identifier?: symbol);
    get left(): Variable;
    set left(argument: Variable);
    get right(): AST;
    set right(body: AST);
    clone(): Lambda;
    visit(visitor: ASTVisitor): void;
}
