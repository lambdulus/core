"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
class Variable extends _1.AST {
    constructor(token, identifier = Symbol()) {
        super();
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
