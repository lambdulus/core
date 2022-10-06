import { Token, TokenType } from "../lexer";
import { MacroTable } from "./";
import { AST } from "../ast";
export declare class Parser {
    private readonly tokens;
    private readonly macroTable;
    private position;
    private openSubexpressions;
    private isMacro;
    constructor(tokens: Array<Token>, macroTable: MacroTable);
    top(): Token;
    canAccept(type: TokenType): boolean;
    accept(type: TokenType): Token;
    acceptClosing(): void;
    exprEnd(): boolean;
    canAcceptClosing(): boolean;
    allClosed(): boolean;
    eof(): boolean;
    parseLambda(): AST;
    /**
     * SINGLE
         := number
         := operator
         := ident
         := ( λ ident { ident } . LEXPR )
         := ( LEXPR )
         := '( LEXPR )
     */
    parseExpression(): AST;
    /**
     * LEXPR := SINGLE { SINGLE }
     */
    parse(leftSide: AST | null): AST;
    parseQuoted(): AST;
}
