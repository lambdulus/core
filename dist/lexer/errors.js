"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hintOperator = exports.InvalidCharacter = exports.InvalidOperator = exports.InvalidNumber = exports.InvalidIdentifier = void 0;
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
class InvalidCharacter extends Error {
    constructor(value, position) {
        super();
        this.value = value;
        this.position = position;
    }
}
exports.InvalidCharacter = InvalidCharacter;
function hintOperator(error, operators) {
    const { value: invalid } = error;
    const relevant = operators.filter((operator) => operator.indexOf(invalid) !== -1
        ||
            invalid.indexOf(operator) !== -1);
    if (!relevant.length) {
        return '';
    }
    return (`Hint: Did you mean to write one of these?
    ${relevant.map((operator) => `${operator}\n`)}`);
}
exports.hintOperator = hintOperator;
