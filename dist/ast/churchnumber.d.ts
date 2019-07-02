import { Token } from '../lexer';
import { AST } from './';
import { ASTVisitor } from '../visitors';
export declare class ChurchNumber extends AST {
    readonly token: Token;
    readonly identifier: symbol;
    constructor(token: Token, identifier?: symbol);
    name(): string;
    clone(): ChurchNumber;
    visit(visitor: ASTVisitor): void;
}
