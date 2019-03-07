import { Token } from '../../lexer';
import { AST, Expandable } from '../parser';
import { Visitor } from '../../visitors/visitor';
export declare class ChurchNumber implements AST, Expandable {
    readonly token: Token;
    readonly identifier: symbol;
    name(): string;
    constructor(token: Token);
    clone(): ChurchNumber;
    visit(visitor: Visitor): void;
    expand(): AST;
    alphaConvert(oldName: string, newName: string): AST;
    betaReduce(argName: string, value: AST): AST;
    etaConvert(): AST;
    freeVarName(bound: Array<string>): string | null;
}
