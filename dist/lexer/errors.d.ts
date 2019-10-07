import { PositionRecord } from "./position";
export declare class InvalidIdentifier extends Error {
    readonly value: string;
    readonly position: PositionRecord;
    constructor(value: string, position: PositionRecord);
}
export declare class InvalidNumber extends Error {
    readonly value: string;
    readonly position: PositionRecord;
    constructor(value: string, position: PositionRecord);
}
export declare class InvalidOperator extends Error {
    readonly value: string;
    readonly position: PositionRecord;
    constructor(value: string, position: PositionRecord);
}
export declare class InvalidCharacter extends Error {
    readonly value: string;
    readonly position: PositionRecord;
    constructor(value: string, position: PositionRecord);
}
export declare function hintOperator(error: InvalidOperator, operators: Array<string>): string;
