"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lambda = void 0;
const _1 = require("./");
class Lambda extends _1.AST {
    constructor(argument, body, identifier = Symbol()) {
        super();
        this.argument = argument;
        this.body = body;
        this.identifier = identifier;
        this.type = 'lambda';
    }
    get left() {
        return this.argument;
    }
    set left(argument) {
        this.argument = argument;
    }
    get right() {
        return this.body;
    }
    set right(body) {
        this.body = body;
    }
    clone() {
        return new Lambda(this.argument.clone(), this.body.clone(), this.identifier);
    }
    visit(visitor) {
        visitor.onLambda(this);
    }
}
exports.Lambda = Lambda;
