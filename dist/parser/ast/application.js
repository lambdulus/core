"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// TODO: remove Binary cause not needed 
var Application = /** @class */ (function () {
    function Application(left, right) {
        this.left = left;
        this.right = right;
        this.identifier = Symbol();
    }
    Application.prototype.clone = function () {
        return new Application(this.left.clone(), this.right.clone());
    };
    Application.prototype.visit = function (visitor) {
        return visitor.onApplication(this);
    };
    Application.prototype.alphaConvert = function (oldName, newName) {
        var left = this.left.alphaConvert(oldName, newName);
        var right = this.right.alphaConvert(oldName, newName);
        return new Application(left, right);
    };
    Application.prototype.betaReduce = function (argName, value) {
        var left = this.left.betaReduce(argName, value);
        var right = this.right.betaReduce(argName, value);
        return new Application(left, right);
    };
    Application.prototype.etaConvert = function () {
        throw new Error("Method not implemented.");
    };
    Application.prototype.freeVarName = function (bound) {
        return this.left.freeVarName(bound) || this.right.freeVarName(bound);
    };
    return Application;
}());
exports.Application = Application;
