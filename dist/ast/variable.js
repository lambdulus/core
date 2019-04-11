"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Variable {
    // public readonly identifier : symbol = Symbol()
    constructor(token, identifier = Symbol()) {
        this.token = token;
        this.identifier = identifier;
    }
    name() {
        return `${this.token.value}`;
    }
    clone() {
        return new Variable(this.token, this.identifier);
    }
    visit(visitor) {
        visitor.onVariable(this);
    }
}
exports.Variable = Variable;
