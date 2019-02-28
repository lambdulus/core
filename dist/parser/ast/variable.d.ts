import { Token } from '../../lexer';
import { AST, ReductionResult } from '../parser';
export declare class Variable implements AST {
    readonly token: Token;
    name(): string;
    constructor(token: Token);
    clone(): Variable;
    reduceNormal(): ReductionResult;
    reduceApplicative(): ReductionResult;
    alphaConvert(oldName: string, newName: string): Variable;
    betaReduce(argName: string, value: AST): AST;
    etaConvert(): AST;
    print(): string;
    freeVarName(bound: Array<string>): string | null;
}
