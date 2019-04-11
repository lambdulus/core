"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Macro {
    // public readonly identifier : symbol = Symbol()
    constructor(token, definition, identifier = Symbol()) {
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
