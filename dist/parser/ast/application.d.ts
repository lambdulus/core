import { AST, ReductionResult } from '../parser';
export declare class Application implements AST {
    readonly lambda: AST;
    readonly argument: AST;
    constructor(lambda: AST, argument: AST);
    clone(): Application;
    reduceNormal(): ReductionResult;
    reduceApplicative(): ReductionResult;
    alphaConvert(oldName: string, newName: string): AST;
    betaReduce(argName: string, value: AST): AST;
    etaConvert(): AST;
    print(): string;
    freeVarName(bound: Array<string>): string | null;
}
