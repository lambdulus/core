import { Token } from '../lexer';
import { Lambda } from './ast/lambda';
import { Variable } from './ast/variable';
import { Macro } from './ast/macro';
import { Application } from './ast/application';
export interface Binary extends AST {
    left: AST;
    right: AST;
}
export interface AST {
    identifier: symbol;
    clone(): AST;
    nextNormal(parent: Binary | null, child: Child | null): NextReduction;
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
    Alpha = 0,
    Beta = 1,
    Expansion = 2,
    None = 3
}
export declare type ReductionResult = {
    tree: AST;
    reduced: boolean;
    reduction: Reduction;
    currentSubtree: AST;
};
export declare enum Child {
    Left = "left",
    Right = "right"
}
export declare type NextReduction = NextAlpha | NextBeta | NextExpansion | NextNone;
export declare class NextAlpha {
    readonly tree: Application;
    readonly child: Child;
    readonly oldName: string;
    readonly newName: string;
    constructor(tree: Application, child: Child, oldName: string, newName: string);
}
export declare class NextBeta {
    readonly parent: Binary | null;
    readonly treeSide: Child | null;
    readonly target: AST;
    readonly argName: string;
    readonly value: AST;
    constructor(parent: Binary | null, treeSide: Child | null, // na jaky strane pro parenta je redukovanej uzel
    target: AST, // EXPR ve kterem se provede nahrada
    argName: string, value: AST);
}
export declare class NextExpansion {
    readonly parent: Binary | null;
    readonly treeSide: Child | null;
    readonly tree: Expandable;
    constructor(parent: Binary | null, treeSide: Child | null, tree: Expandable);
}
export declare class NextNone {
}
export declare function parse(tokens: Array<Token>): AST;
declare const _default: {
    parse: typeof parse;
    Lambda: typeof Lambda;
    Variable: typeof Variable;
    Macro: typeof Macro;
    Application: typeof Application;
};
export default _default;
