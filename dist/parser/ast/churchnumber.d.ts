import { Token } from '../../lexer';
import { AST } from '..';
import { ASTVisitor } from '../../visitors';
export declare class ChurchNumber implements AST {
    readonly token: Token;
    readonly identifier: symbol;
    name(): string;
    constructor(token: Token);
    clone(): ChurchNumber;
    visit(visitor: ASTVisitor): void;
}
