import { Token } from '../lexer';
import { AST, Application, Lambda, Macro, Variable } from '../ast';
export declare class MacroDef {
    readonly ast: AST;
    constructor(ast: AST);
}
export interface MacroTable {
    [name: string]: MacroDef;
}
export declare function parse(tokens: Array<Token>, userMacros: MacroTable): AST;
export declare const builtinMacros: Array<string>;
declare const _default: {
    parse: typeof parse;
    Lambda: typeof Lambda;
    Variable: typeof Variable;
    Macro: typeof Macro;
    Application: typeof Application;
};
export default _default;
