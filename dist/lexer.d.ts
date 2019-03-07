import { PositionRecord } from './counter';
export declare enum TokenType {
    Lambda = "lambda",
    Dot = "dot",
    Identifier = "identifier",
    Number = "number",
    Operator = "operator",
    LeftParen = "left paren",
    RightParen = "right paren"
}
export declare class Token {
    readonly type: TokenType;
    readonly value: string | number;
    readonly position: PositionRecord;
    constructor(type: TokenType, value: string | number, position: PositionRecord);
}
export declare type CodeStyle = {
    singleLetterVars: boolean;
    lambdaLetters: Array<string>;
};
export declare function tokenize(input: string, config: CodeStyle): Array<Token>;
declare const _default: {
    tokenize: typeof tokenize;
};
export default _default;
