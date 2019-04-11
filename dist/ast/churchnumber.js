"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ChurchNumber {
    // public readonly identifier : symbol = Symbol()
    constructor(token, identifier = Symbol()) {
        this.token = token;
        this.identifier = identifier;
    }
    name() {
        return `${this.token.value}`;
    }
    clone() {
        return new ChurchNumber(this.token, this.identifier);
    }
    visit(visitor) {
        visitor.onChurchNumber(this);
    }
}
exports.ChurchNumber = ChurchNumber;
