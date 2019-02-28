import { Token } from '../../lexer';
import { AST, ReductionResult, Expandable, MacroDef } from '../parser';
export declare class Macro implements AST, Expandable {
    readonly token: Token;
    readonly definition: MacroDef;
    name(): string;
    constructor(token: Token, definition: MacroDef);
    clone(): Macro;
    reduceNormal(): ReductionResult;
    expand(): AST;
    reduceApplicative(): ReductionResult;
    alphaConvert(oldName: string, newName: string): AST;
    betaReduce(argName: string, value: AST): AST;
    etaConvert(): AST;
    print(): string;
    freeVarName(bound: Array<string>): string | null;
}
