import { Token } from '../lexer';
import { AST } from './';
import { MacroTable } from '../parser';
import { ASTVisitor } from '../visitors';
export declare class Macro extends AST {
    readonly token: Token;
    readonly macroTable: MacroTable;
    readonly identifier: symbol;
    type: string;
    constructor(token: Token, macroTable: MacroTable, identifier?: symbol);
    name(): string;
    clone(): Macro;
    visit(visitor: ASTVisitor): void;
}
