"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Application {
    constructor(left, right) {
        this.left = left;
        this.right = right;
        this.identifier = Symbol();
    }
    clone() {
        return new Application(this.left.clone(), this.right.clone());
    }
    visit(visitor) {
        return visitor.onApplication(this);
    }
}
exports.Application = Application;
