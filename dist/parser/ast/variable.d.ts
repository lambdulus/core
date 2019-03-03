import { Token } from '../../lexer';
import { AST, ReductionResult, NextReduction, Child } from '../parser';
export declare class Variable implements AST {
    readonly token: Token;
    readonly identifier: symbol;
    name(): string;
    constructor(token: Token);
    clone(): Variable;
    nextNormal(parent: AST | null, child: Child | null): NextReduction;
    reduceNormal(): ReductionResult;
    reduceApplicative(): ReductionResult;
    alphaConvert(oldName: string, newName: string): Variable;
    betaReduce(argName: string, value: AST): AST;
    etaConvert(): AST;
    print(): string;
    freeVarName(bound: Array<string>): string | null;
}
