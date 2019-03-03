import { Token } from '../../lexer';
import { AST, ReductionResult, Expandable, MacroDef, NextReduction, Child } from '../parser';
export declare class Macro implements AST, Expandable {
    readonly token: Token;
    readonly definition: MacroDef;
    readonly identifier: symbol;
    name(): string;
    constructor(token: Token, definition: MacroDef);
    clone(): Macro;
    nextNormal(parent: AST | null, child: Child): NextReduction;
    reduceNormal(): ReductionResult;
    expand(): AST;
    reduceApplicative(): ReductionResult;
    alphaConvert(oldName: string, newName: string): AST;
    betaReduce(argName: string, value: AST): AST;
    etaConvert(): AST;
    print(): string;
    freeVarName(bound: Array<string>): string | null;
}
