import { AST, Binary, ReductionResult, NextReduction, Child } from '../parser';
export declare class Application implements Binary {
    left: AST;
    right: AST;
    readonly identifier: symbol;
    constructor(left: AST, right: AST);
    clone(): Application;
    nextNormal(parent: Binary | null, child: Child | null): NextReduction;
    reduceNormal(): ReductionResult;
    reduceApplicative(): ReductionResult;
    alphaConvert(oldName: string, newName: string): AST;
    betaReduce(argName: string, value: AST): AST;
    etaConvert(): AST;
    print(): string;
    freeVarName(bound: Array<string>): string | null;
}
