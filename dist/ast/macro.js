"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Macro = void 0;
const _1 = require("./");
class Macro extends _1.AST {
    constructor(token, 
    // TODO: @dynamic-macros
    // public readonly definition : MacroDef,
    macroTable, identifier = Symbol()) {
        super();
        this.token = token;
        this.macroTable = macroTable;
        this.identifier = identifier;
        this.type = 'macro';
    }
    name() {
        return `${this.token.value}`;
    }
    clone() {
        // TODO: @dynamic-macros
        return new Macro(this.token, this.macroTable, this.identifier);
    }
    visit(visitor) {
        visitor.onMacro(this);
    }
}
exports.Macro = Macro;
