import { PositionRecord } from "./postion";
export declare class Counter {
    column: number;
    row: number;
    position: number;
    toRecord(): PositionRecord;
    newLine(): void;
    nextChar(): void;
}
