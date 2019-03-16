import { Token } from '../../lexer';
import { AST, MacroDef } from '..';
import { ASTVisitor } from '../../visitors';
export declare class Macro implements AST {
    readonly token: Token;
    readonly definition: MacroDef;
    readonly identifier: symbol;
    name(): string;
    constructor(token: Token, definition: MacroDef);
    clone(): Macro;
    visit(visitor: ASTVisitor): void;
}
