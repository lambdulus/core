"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = void 0;
const _1 = require("./");
class Application extends _1.AST {
    constructor(left, right, identifier = Symbol()) {
        super();
        this.left = left;
        this.right = right;
        this.identifier = identifier;
        this.type = 'application';
    }
    clone() {
        return new Application(this.left.clone(), this.right.clone(), this.identifier);
    }
    visit(visitor) {
        return visitor.onApplication(this);
    }
}
exports.Application = Application;
