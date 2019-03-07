import { Token } from '../../lexer';
import { AST, Binary, ReductionResult, NextReduction, Child } from '../parser';
import { Visitor } from '../../visitors/visitor';
export declare class Variable implements AST {
    readonly token: Token;
    readonly identifier: symbol;
    name(): string;
    constructor(token: Token);
    clone(): Variable;
    visit(visitor: Visitor): void;
    nextNormal(parent: Binary | null, child: Child | null): NextReduction;
    reduceNormal(): ReductionResult;
    reduceApplicative(): ReductionResult;
    alphaConvert(oldName: string, newName: string): Variable;
    betaReduce(argName: string, value: AST): AST;
    etaConvert(): AST;
    print(): string;
    freeVarName(bound: Array<string>): string | null;
}
