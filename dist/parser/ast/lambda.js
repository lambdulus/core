"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Lambda = /** @class */ (function () {
    function Lambda(argument, body) {
        this.argument = argument;
        this.body = body;
        this.identifier = Symbol();
    }
    Object.defineProperty(Lambda.prototype, "left", {
        get: function () {
            return this.argument;
        },
        set: function (argument) {
            this.argument = argument;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Lambda.prototype, "right", {
        get: function () {
            return this.body;
        },
        set: function (body) {
            this.body = body;
        },
        enumerable: true,
        configurable: true
    });
    Lambda.prototype.clone = function () {
        return new Lambda(this.argument, this.body);
    };
    Lambda.prototype.visit = function (visitor) {
        visitor.onLambda(this);
    };
    // nextNormal (parent : Binary | null, child : Child | null) : NextReduction {
    //   return this.body.nextNormal(this, Child.Right)
    // }
    // reduceNormal () : ReductionResult {
    //   const { tree, reduced, reduction, currentSubtree } : ReductionResult = this.body.reduceNormal()
    //   this.body = tree
    //   return { tree : this, reduced, reduction, currentSubtree }
    // }
    // reduceApplicative () : ReductionResult {
    //   throw new Error("Method not implemented.");
    // }
    Lambda.prototype.alphaConvert = function (oldName, newName) {
        var left = this.argument.alphaConvert(oldName, newName);
        var right = this.body.alphaConvert(oldName, newName);
        this.argument = left;
        this.body = right;
        return this;
    };
    Lambda.prototype.betaReduce = function (argName, value) {
        if (this.argument.name() === argName) {
            return this; // TODO: should I create new one? probably
        }
        return new Lambda(this.argument.clone(), this.body.betaReduce(argName, value));
    };
    Lambda.prototype.etaConvert = function () {
        throw new Error("Method not implemented.");
    };
    // print () : string {
    //   if (this.body instanceof Lambda) {
    //     return `(λ ${ this.printLambdaArguments(this.argument.name()) } . ${ this.printLambdaBody() })`
    //   }
    //   return `(λ ${ this.argument.print() } . ${ this.body.print() })`
    // }
    Lambda.prototype.freeVarName = function (bound) {
        return this.body.freeVarName(bound.concat([this.argument.name()]));
    };
    Lambda.prototype.isBound = function (varName) {
        if (this.argument.name() === varName) {
            return true;
        }
        if (this.body instanceof Lambda) {
            return this.body.isBound(varName);
        }
        return false;
    };
    return Lambda;
}());
exports.Lambda = Lambda;
