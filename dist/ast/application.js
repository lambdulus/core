"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Application {
    // public readonly identifier : symbol = Symbol()
    constructor(left, right, identifier = Symbol()) {
        this.left = left;
        this.right = right;
        this.identifier = identifier;
    }
    clone() {
        return new Application(this.left.clone(), this.right.clone(), this.identifier);
    }
    visit(visitor) {
        return visitor.onApplication(this);
    }
}
exports.Application = Application;
