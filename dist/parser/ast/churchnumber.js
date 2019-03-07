"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ChurchNumber {
    constructor(token) {
        this.token = token;
        this.identifier = Symbol();
    }
    name() {
        return `${this.token.value}`;
    }
    clone() {
        return new ChurchNumber(this.token);
    }
    visit(visitor) {
        visitor.onChurchNumber(this);
    }
}
exports.ChurchNumber = ChurchNumber;
