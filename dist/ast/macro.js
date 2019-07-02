"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
class Macro extends _1.AST {
    constructor(token, definition, identifier = Symbol()) {
        super();
        this.token = token;
        this.definition = definition;
        this.identifier = identifier;
    }
    name() {
        return `${this.token.value}`;
    }
    clone() {
        return new Macro(this.token, this.definition, this.identifier);
    }
    visit(visitor) {
        visitor.onMacro(this);
    }
}
exports.Macro = Macro;
