import { AST, ReductionResult } from '../parser';
import { Variable } from './variable';
export declare class Lambda implements AST {
    readonly argument: Variable;
    readonly body: AST;
    constructor(argument: Variable, body: AST);
    clone(): Lambda;
    reduceNormal(): ReductionResult;
    reduceApplicative(): ReductionResult;
    alphaConvert(oldName: string, newName: string): AST;
    betaReduce(argName: string, value: AST): AST;
    etaConvert(): AST;
    print(): string;
    freeVarName(bound: Array<string>): string | null;
    isBound(varName: string): boolean;
    printLambdaArguments(accumulator: string): string;
    printLambdaBody(): string;
}
