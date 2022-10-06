import { AST, Binary } from './';
import { ASTVisitor } from '../visitors';
export declare class Application extends AST implements Binary {
    left: AST;
    right: AST;
    readonly identifier: symbol;
    type: string;
    constructor(left: AST, right: AST, identifier?: symbol);
    clone(): Application;
    visit(visitor: ASTVisitor): void;
}
