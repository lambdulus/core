import { Token } from '../lexer';
import { Lambda } from './ast/lambda';
import { Variable } from './ast/variable';
import { Macro } from './ast/macro';
import { Application } from './ast/application';
export interface AST {
    clone(): AST;
    reduceNormal(): ReductionResult;
    reduceApplicative(): ReductionResult;
    print(): string;
    alphaConvert(oldName: string, newName: string): AST;
    betaReduce(argName: string, value: AST): AST;
    etaConvert(): AST;
    freeVarName(bound: Array<string>): string | null;
}
export interface Expandable {
    expand(): AST;
}
export declare class MacroDef {
    readonly ast: AST;
    constructor(ast: AST);
}
export declare enum Reduction {
    alpha = 0,
    beta = 1,
    expansion = 2,
    none = 3
}
export declare type ReductionResult = {
    tree: AST;
    reduced: boolean;
    reduction: Reduction;
    currentSubtree: AST;
};
export declare function parse(tokens: Array<Token>): AST;
declare const _default: {
    parse: typeof parse;
    Lambda: typeof Lambda;
    Variable: typeof Variable;
    Macro: typeof Macro;
    Application: typeof Application;
};
export default _default;
