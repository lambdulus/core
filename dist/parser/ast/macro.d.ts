import { Token } from '../../lexer';
import { AST, Binary, ReductionResult, Expandable, MacroDef, NextReduction, Child } from '../parser';
import { Visitor } from '../../visitors/visitor';
export declare class Macro implements AST, Expandable {
    readonly token: Token;
    readonly definition: MacroDef;
    readonly identifier: symbol;
    name(): string;
    constructor(token: Token, definition: MacroDef);
    clone(): Macro;
    visit(visitor: Visitor): void;
    nextNormal(parent: Binary | null, child: Child | null): NextReduction;
    reduceNormal(): ReductionResult;
    expand(): AST;
    reduceApplicative(): ReductionResult;
    alphaConvert(oldName: string, newName: string): AST;
    betaReduce(argName: string, value: AST): AST;
    etaConvert(): AST;
    print(): string;
    freeVarName(bound: Array<string>): string | null;
}
