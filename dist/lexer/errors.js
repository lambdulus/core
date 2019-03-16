"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InvalidIdentifier extends Error {
    constructor(value, position) {
        super();
        this.value = value;
        this.position = position;
    }
}
exports.InvalidIdentifier = InvalidIdentifier;
class InvalidNumber extends Error {
    constructor(value, position) {
        super();
        this.value = value;
        this.position = position;
    }
}
exports.InvalidNumber = InvalidNumber;
class InvalidOperator extends Error {
    constructor(value, position) {
        super();
        this.value = value;
        this.position = position;
    }
}
exports.InvalidOperator = InvalidOperator;
