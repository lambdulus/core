import { Token } from '../lexer';
import { Lambda } from './ast/lambda';
import { Variable } from './ast/variable';
import { Macro } from './ast/macro';
import { Application } from './ast/application';
import { ASTVisitable } from '../visitors';
export interface Binary extends AST {
    left: AST;
    right: AST;
}
export interface AST extends ASTVisitable {
    identifier: symbol;
    clone(): AST;
}
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
