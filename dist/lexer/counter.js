"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlankPosition = {
    column: -1,
    row: -1,
    position: -1,
};
class Counter {
    constructor() {
        this.column = 0;
        this.row = 0;
        this.position = 0;
    }
    toRecord() {
        return { column: this.column, row: this.row, position: this.position };
    }
    newLine() {
        this.column = 0;
        this.row++;
        this.position++;
    }
    nextChar() {
        this.column++;
        this.position++;
    }
}
exports.Counter = Counter;
