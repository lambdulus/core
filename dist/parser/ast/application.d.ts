import { AST, Binary } from '..';
import { ASTVisitor } from '../../visitors';
export declare class Application implements AST, Binary {
    left: AST;
    right: AST;
    readonly identifier: symbol;
    constructor(left: AST, right: AST);
    clone(): Application;
    visit(visitor: ASTVisitor): void;
}
