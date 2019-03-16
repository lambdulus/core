import { Token } from '../../lexer';
import { AST } from '..';
import { ASTVisitor } from '../../visitors';
export declare class Variable implements AST {
    readonly token: Token;
    readonly identifier: symbol;
    name(): string;
    constructor(token: Token);
    clone(): Variable;
    visit(visitor: ASTVisitor): void;
}
