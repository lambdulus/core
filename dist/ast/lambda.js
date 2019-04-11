"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Lambda {
    // public readonly identifier : symbol = Symbol()
    constructor(argument, body, identifier = Symbol()) {
        this.argument = argument;
        this.body = body;
        this.identifier = identifier;
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
        return new Lambda(this.argument.clone(), this.body.clone(), this.identifier);
    }
    visit(visitor) {
        visitor.onLambda(this);
    }
}
exports.Lambda = Lambda;
