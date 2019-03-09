import { Token } from '../lexer';
import { AST } from '../ast';
import { Application } from '../ast/application';
import { Lambda } from '../ast/lambda';
import { Macro } from '../ast/macro';
import { Variable } from '../ast/variable';
export declare class MacroDef {
    readonly ast: AST;
    constructor(ast: AST);
}
export interface MacroTable {
    [name: string]: MacroDef;
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
