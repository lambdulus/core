import { Token } from '../lexer';
import { AST } from './';
import { ASTVisitor } from '../visitors';
export declare class Variable implements AST {
    readonly token: Token;
    readonly identifier: symbol;
    constructor(token: Token);
    name(): string;
    clone(): Variable;
    visit(visitor: ASTVisitor): void;
}
