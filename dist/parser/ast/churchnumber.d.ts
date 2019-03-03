import { Token } from '../../lexer';
import { AST, Binary, ReductionResult, Expandable, NextReduction, Child } from '../parser';
export declare class ChurchNumber implements AST, Expandable {
    readonly token: Token;
    readonly identifier: symbol;
    name(): string;
    constructor(token: Token);
    clone(): ChurchNumber;
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
