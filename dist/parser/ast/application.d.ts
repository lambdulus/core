import { AST, ReductionResult, NextReduction, Child } from '../parser';
export declare class Application implements AST {
    left: AST;
    right: AST;
    readonly identifier: symbol;
    constructor(left: AST, right: AST);
    clone(): Application;
    nextNormal(parent: AST | null, child: Child): NextReduction;
    reduceNormal(): ReductionResult;
    reduceApplicative(): ReductionResult;
    alphaConvert(oldName: string, newName: string): AST;
    betaReduce(argName: string, value: AST): AST;
    etaConvert(): AST;
    print(): string;
    freeVarName(bound: Array<string>): string | null;
}
