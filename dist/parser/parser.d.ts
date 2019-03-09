import { Token, TokenType } from "../lexer";
import { MacroTable, AST } from ".";
export declare class Parser {
    private readonly tokens;
    private readonly macroTable;
    private position;
    private isMacro;
    constructor(tokens: Array<Token>, macroTable: MacroTable);
    top(): Token;
    canAccept(type: TokenType): boolean;
    accept(type: TokenType): void;
    exprEnd(): boolean;
    parseLambda(): AST;
    /**
     * SINGLE
         := number
         := operator
         := ident
         := '(' λ ident { ident } '.' LEXPR ')'
         := '(' LEXPR ')'
     */
    parseExpression(): AST;
    /**
     * LEXPR := SINGLE { SINGLE }
     */
    parse(leftSide: AST | null): AST;
}
