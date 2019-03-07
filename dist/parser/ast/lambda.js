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
    // alphaConvert (oldName : string, newName : string) : AST {
    //   const left : Variable = this.argument.alphaConvert(oldName, newName)
    //   const right : AST = this.body.alphaConvert(oldName, newName)
    //   this.argument = left
    //   this.body = right
    //   return this
    // }
    // betaReduce (argName : string, value : AST) : AST {
    //   if (this.argument.name() === argName) {
    //     return this
    //   }
    //   // TODO: clone or not clone ? i'd say CLONE but consider not clonning
    //   return new Lambda(this.argument.clone(), this.body.betaReduce(argName, value))
    // }
    // etaConvert () : AST {
    //   throw new Error("Method not implemented.");
    // }
    // freeVarName (bound : Array<string>) : string | null {
    //   return this.body.freeVarName([ ...bound, this.argument.name()])
    // }
    isBound(varName) {
        if (this.argument.name() === varName) {
            return true;
        }
        if (this.body instanceof Lambda) {
            return this.body.isBound(varName);
        }
        return false;
    }
}
exports.Lambda = Lambda;
