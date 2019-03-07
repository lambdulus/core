"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Macro {
    constructor(token, definition) {
        this.token = token;
        this.definition = definition;
        this.identifier = Symbol();
    }
    name() {
        return `${this.token.value}`;
    }
    clone() {
        return new Macro(this.token, this.definition);
    }
    visit(visitor) {
        visitor.onMacro(this);
    }
}
exports.Macro = Macro;
