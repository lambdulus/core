import { Token } from '../lexer';
import { AST } from './';
import { ASTVisitor } from '../visitors';
export declare class Variable extends AST {
    readonly token: Token;
    readonly identifier: symbol;
    type: string;
    constructor(token: Token, identifier?: symbol);
    name(): string;
    clone(): Variable;
    visit(visitor: ASTVisitor): void;
}
