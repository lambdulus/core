"use strict";
exports.__esModule = true;
var Counter = /** @class */ (function () {
    function Counter() {
        this.column = 0;
        this.row = 0;
        this.position = 0;
    }
    Counter.prototype.toRecord = function () {
        return { column: this.column, row: this.row, position: this.position };
    };
    Counter.prototype.newLine = function () {
        this.column = 0;
        this.row++;
        this.position++;
    };
    Counter.prototype.nextChar = function () {
        this.column++;
        this.position++;
    };
    return Counter;
}());
exports["default"] = Counter;
