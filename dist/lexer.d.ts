import { PositionRecord } from './counter';
export declare enum TokenType {
    Lambda = 0,
    Dot = 1,
    Identifier = 2,
    Number = 3,
    Operator = 4,
    LeftParen = 5,
    RightParen = 6
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
