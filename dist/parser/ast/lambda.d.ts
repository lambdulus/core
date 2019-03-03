import { AST, ReductionResult, NextReduction, Child } from '../parser';
import { Variable } from './variable';
export declare class Lambda implements AST {
    argument: Variable;
    body: AST;
    readonly identifier: symbol;
    constructor(argument: Variable, body: AST);
    clone(): Lambda;
    nextNormal(parent: AST | null, child: Child): NextReduction;
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
