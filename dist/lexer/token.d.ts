import { PositionRecord } from "./counter";
export declare enum TokenType {
    Lambda = "lambda",
    Dot = "dot",
    Identifier = "identifier",
    Number = "number",
    Operator = "operator",
    LeftParen = "left paren",
    RightParen = "right paren",
    RightBracket = "right bracket",
    BackTick = "backtick"
}
export declare class Token {
    readonly type: TokenType;
    readonly value: string | number;
    readonly position: PositionRecord;
    constructor(type: TokenType, value: string | number, position: PositionRecord);
}
