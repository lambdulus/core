import { Token } from '../../lexer';
import { AST } from '../parser';
import { Visitor } from '../../visitors/visitor';
export declare class Variable implements AST {
    readonly token: Token;
    readonly identifier: symbol;
    name(): string;
    constructor(token: Token);
    clone(): Variable;
    visit(visitor: Visitor): void;
    alphaConvert(oldName: string, newName: string): Variable;
    betaReduce(argName: string, value: AST): AST;
    etaConvert(): AST;
    freeVarName(bound: Array<string>): string | null;
}
