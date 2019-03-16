"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Lambda {
    constructor(argument, body) {
        this.argument = argument;
        this.body = body;
        this.identifier = Symbol();
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
        // TODO: consider not clonning
        return new Lambda(this.argument.clone(), this.body.clone());
    }
    visit(visitor) {
        visitor.onLambda(this);
    }
}
exports.Lambda = Lambda;
