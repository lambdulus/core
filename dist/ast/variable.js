"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Variable {
    constructor(token) {
        this.token = token;
        this.identifier = Symbol();
    }
    name() {
        return `${this.token.value}`;
    }
    clone() {
        return new Variable(this.token);
    }
    visit(visitor) {
        visitor.onVariable(this);
    }
}
exports.Variable = Variable;
