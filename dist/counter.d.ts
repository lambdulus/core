export interface PositionRecord {
    column: number;
    row: number;
    position: number;
}
export default class Counter {
    column: number;
    row: number;
    position: number;
    toRecord(): PositionRecord;
    newLine(): void;
    nextChar(): void;
}
