import { Token } from '../../lexer';
import { AST, Expandable, MacroDef } from '..';
import { Visitor } from '../../visitors/visitor';
export declare class Macro implements AST, Expandable {
    readonly token: Token;
    readonly definition: MacroDef;
    readonly identifier: symbol;
    name(): string;
    constructor(token: Token, definition: MacroDef);
    clone(): Macro;
    visit(visitor: Visitor): void;
    expand(): AST;
    alphaConvert(oldName: string, newName: string): AST;
    betaReduce(argName: string, value: AST): AST;
    etaConvert(): AST;
    freeVarName(bound: Array<string>): string | null;
}
