import { Token } from '../lexer';
import { AST } from './';
import { MacroDef } from '../parser';
import { ASTVisitor } from '../visitors';
export declare class Macro implements AST {
    readonly token: Token;
    readonly definition: MacroDef;
    readonly identifier: symbol;
    constructor(token: Token, definition: MacroDef);
    name(): string;
    clone(): Macro;
    visit(visitor: ASTVisitor): void;
}
