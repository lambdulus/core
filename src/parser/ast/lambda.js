"use strict";
exports.__esModule = true;
var Lambda = /** @class */ (function () {
    function Lambda(argument, body) {
        this.argument = argument;
        this.body = body;
    }
    Lambda.prototype.clone = function () {
        return new Lambda(this.argument, this.body);
    };
    Lambda.prototype.reduceNormal = function () {
        var _a = this.body.clone().reduceNormal(), body = _a.tree, reduced = _a.reduced, reduction = _a.reduction, currentSubtree = _a.currentSubtree;
        var tree = new Lambda(this.argument.clone(), body);
        return { tree: tree, reduced: reduced, reduction: reduction, currentSubtree: currentSubtree };
    };
    Lambda.prototype.reduceApplicative = function () {
        throw new Error("Method not implemented.");
    };
    Lambda.prototype.alphaConvert = function (oldName, newName) {
        var left = this.argument.clone().alphaConvert(oldName, newName);
        var right = this.body.clone().alphaConvert(oldName, newName);
        return new Lambda(left, right);
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
    Lambda.prototype.print = function () {
        if (this.body instanceof Lambda) {
            return "(\u03BB " + this.printLambdaArguments(this.argument.name()) + " . " + this.printLambdaBody() + ")";
        }
        return "(\u03BB " + this.argument.print() + " . " + this.body.print() + ")";
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
    Lambda.prototype.printLambdaArguments = function (accumulator) {
        if (this.body instanceof Lambda) {
            return this.body.printLambdaArguments(accumulator + " " + this.body.argument.name());
        }
        return accumulator;
    };
    Lambda.prototype.printLambdaBody = function () {
        if (this.body instanceof Lambda) {
            return this.body.printLambdaBody();
        }
        return this.body.print();
    };
    return Lambda;
}());
exports.Lambda = Lambda;
