import { AST, Binary } from '../parser';
import { Variable } from './variable';
import { Visitor } from '../../visitors/visitor';
export declare class Lambda implements Binary {
    argument: Variable;
    body: AST;
    readonly identifier: symbol;
    constructor(argument: Variable, body: AST);
    left: Variable;
    right: AST;
    clone(): Lambda;
    visit(visitor: Visitor): void;
    alphaConvert(oldName: string, newName: string): AST;
    betaReduce(argName: string, value: AST): AST;
    etaConvert(): AST;
    freeVarName(bound: Array<string>): string | null;
    isBound(varName: string): boolean;
}
