export interface PositionRecord {
    column: number;
    row: number;
    position: number;
}
export declare const BlankPosition: {
    column: number;
    row: number;
    position: number;
};
export declare class Counter {
    column: number;
    row: number;
    position: number;
    toRecord(): PositionRecord;
    newLine(): void;
    nextChar(): void;
}
