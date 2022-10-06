"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChurchNumeral = void 0;
const _1 = require(".");
class ChurchNumeral extends _1.AST {
    constructor(token, identifier = Symbol()) {
        super();
        this.token = token;
        this.identifier = identifier;
        this.type = 'churchnumeral';
    }
    name() {
        return `${this.token.value}`;
    }
    clone() {
        return new ChurchNumeral(this.token, this.identifier);
    }
    visit(visitor) {
        visitor.onChurchNumeral(this);
    }
}
exports.ChurchNumeral = ChurchNumeral;
