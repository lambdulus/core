import { AST, Binary, ReductionResult, NextReduction, Child } from '../parser';
import { Variable } from './variable';
export declare class Lambda implements Binary {
    argument: Variable;
    body: AST;
    readonly identifier: symbol;
    constructor(argument: Variable, body: AST);
    left: Variable;
    right: AST;
    clone(): Lambda;
    nextNormal(parent: Binary | null, child: Child | null): NextReduction;
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
