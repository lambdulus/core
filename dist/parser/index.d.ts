import { Token } from '../lexer';
import { AST } from '../ast';
export declare class MacroDef {
    readonly ast: AST;
    constructor(ast: AST);
}
export interface MacroTable {
    [name: string]: string;
}
export interface MacroMap {
    [name: string]: string;
}
export declare const builtinMacros: MacroMap;
export declare function parse(tokens: Array<Token>, userMacros: MacroMap): AST;
declare const _default: {
    parse: typeof parse;
};
export default _default;
