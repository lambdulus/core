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
        // TODO: consider not clonning
        return new Lambda(this.argument.clone(), this.body.clone());
    };
    Lambda.prototype.visit = function (visitor) {
        visitor.onLambda(this);
    };
    Lambda.prototype.alphaConvert = function (oldName, newName) {
        var left = this.argument.alphaConvert(oldName, newName);
        var right = this.body.alphaConvert(oldName, newName);
        this.argument = left;
        this.body = right;
        return this;
    };
    Lambda.prototype.betaReduce = function (argName, value) {
        if (this.argument.name() === argName) {
            return this;
        }
        // TODO: clone or not clone ? i'd say CLONE but consider not clonning
        return new Lambda(this.argument.clone(), this.body.betaReduce(argName, value));
    };
    Lambda.prototype.etaConvert = function () {
        throw new Error("Method not implemented.");
    };
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
