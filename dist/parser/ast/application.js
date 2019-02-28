"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parser_1 = require("../parser");
var variable_1 = require("./variable");
var lambda_1 = require("./lambda");
var Application = /** @class */ (function () {
    function Application(lambda, argument) {
        this.lambda = lambda;
        this.argument = argument;
    }
    Application.prototype.clone = function () {
        return new Application(this.lambda.clone(), this.argument.clone());
    };
    Application.prototype.reduceNormal = function () {
        if (this.lambda instanceof variable_1.Variable) {
            var _a = this.argument.reduceNormal(), left = _a.tree, reduced = _a.reduced, reduction = _a.reduction, currentSubtree = _a.currentSubtree;
            var tree = new Application(this.lambda.clone(), left);
            return { tree: tree, reduced: reduced, reduction: reduction, currentSubtree: currentSubtree };
        }
        else if (this.lambda instanceof lambda_1.Lambda) {
            var freeVar = this.argument.freeVarName([]);
            if (freeVar && this.lambda.isBound(freeVar) && this.lambda.argument.name() !== freeVar) {
                // TODO: refactor condition PLS it looks awful
                // second third mainly
                // TODO: find truly original non conflicting new name probably using number postfixes
                var left = this.lambda.alphaConvert(freeVar, "_" + freeVar);
                var tree_1 = new Application(left, this.argument);
                // TODO: decide which node is currentsubstree if α is issued: this or this.lambda
                return { tree: tree_1, reduced: true, reduction: parser_1.Reduction.alpha, currentSubtree: tree_1 };
            }
            // search for free Vars in right which are bound in left OK
            // if any, do α conversion and return
            // if none, do β reduction and return
            var name_1 = this.lambda.argument.name();
            var substituent = this.argument;
            var tree = this.lambda.body.betaReduce(name_1, substituent);
            return { tree: tree, reduced: true, reduction: parser_1.Reduction.beta, currentSubtree: tree }; // currentSubtree
        }
        else { // (this.lambda instanceof Macro || this.lambda instanceof ChurchNumber)
            var _b = this.lambda.reduceNormal(), right = _b.tree, reduced = _b.reduced, reduction = _b.reduction, currentSubtree = _b.currentSubtree;
            var tree = new Application(right, this.argument.clone());
            return { tree: tree, reduced: reduced, reduction: reduction, currentSubtree: currentSubtree };
        }
    };
    Application.prototype.reduceApplicative = function () {
        throw new Error("Method not implemented.");
    };
    Application.prototype.alphaConvert = function (oldName, newName) {
        var left = this.lambda.alphaConvert(oldName, newName);
        var right = this.argument.alphaConvert(oldName, newName);
        return new Application(left, right);
    };
    Application.prototype.betaReduce = function (argName, value) {
        var left = this.lambda.betaReduce(argName, value);
        var right = this.argument.betaReduce(argName, value);
        return new Application(left, right);
    };
    Application.prototype.etaConvert = function () {
        throw new Error("Method not implemented.");
    };
    Application.prototype.print = function () {
        if (this.argument instanceof Application) {
            return this.lambda.print() + " (" + this.argument.print() + ")";
        }
        return this.lambda.print() + " " + this.argument.print();
    };
    Application.prototype.freeVarName = function (bound) {
        return this.lambda.freeVarName(bound) || this.argument.freeVarName(bound);
    };
    return Application;
}());
exports.Application = Application;
