"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parser_1 = require("../parser");
var variable_1 = require("./variable");
var lambda_1 = require("./lambda");
var Application = /** @class */ (function () {
    function Application(left, right) {
        this.left = left;
        this.right = right;
        this.identifier = Symbol();
    }
    Application.prototype.clone = function () {
        return new Application(this.left.clone(), this.right.clone());
    };
    Application.prototype.nextNormal = function (parent, child) {
        if (this.left instanceof variable_1.Variable) {
            return this.right.nextNormal(this, parser_1.Child.Right);
        }
        else if (this.left instanceof lambda_1.Lambda) {
            var freeVar = this.right.freeVarName([]);
            if (freeVar && this.left.isBound(freeVar) && this.left.argument.name() !== freeVar) {
                // TODO: refactor condition PLS it looks awful
                // second third mainly
                // TODO: find truly original non conflicting new name probably using number postfixes
                return new parser_1.NextAlpha(this, parser_1.Child.Left, freeVar, "_" + freeVar);
            }
            // search for free Vars in right which are bound in left OK
            // if any, do α conversion and return
            // if none, do β reduction and return
            return new parser_1.NextBeta(parent, child, this.left.body, this.left.argument.name(), this.right);
        }
        else { // (this.left instanceof Macro || this.left instanceof ChurchNumber)
            return this.left.nextNormal(this, parser_1.Child.Left);
        }
    };
    Application.prototype.reduceNormal = function () {
        if (this.left instanceof variable_1.Variable) {
            var _a = this.right.reduceNormal(), tree = _a.tree, reduced = _a.reduced, reduction = _a.reduction, currentSubtree = _a.currentSubtree;
            this.right = tree;
            return { tree: this, reduced: reduced, reduction: reduction, currentSubtree: currentSubtree };
        }
        else if (this.left instanceof lambda_1.Lambda) {
            var freeVar = this.right.freeVarName([]);
            if (freeVar && this.left.isBound(freeVar) && this.left.argument.name() !== freeVar) {
                // TODO: refactor condition PLS it looks awful
                // second third mainly
                // TODO: find truly original non conflicting new name probably using number postfixes
                var left = this.left.alphaConvert(freeVar, "_" + freeVar);
                // const tree : AST = new Application(left, this.right)
                this.left = left;
                // TODO: decide which node is currentsubstree if α is issued: this or this.left
                return { tree: this, reduced: true, reduction: parser_1.Reduction.Alpha, currentSubtree: this };
            }
            // search for free Vars in right which are bound in left OK
            // if any, do α conversion and return
            // if none, do β reduction and return
            var name_1 = this.left.argument.name();
            var substituent = this.right;
            var tree = this.left.body.betaReduce(name_1, substituent);
            return { tree: tree, reduced: true, reduction: parser_1.Reduction.Beta, currentSubtree: tree }; // currentSubtree
        }
        else { // (this.left instanceof Macro || this.left instanceof ChurchNumber)
            var _b = this.left.reduceNormal(), tree = _b.tree, reduced = _b.reduced, reduction = _b.reduction, currentSubtree = _b.currentSubtree;
            this.left = tree;
            return { tree: this, reduced: reduced, reduction: reduction, currentSubtree: currentSubtree };
        }
    };
    Application.prototype.reduceApplicative = function () {
        throw new Error("Method not implemented.");
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
    Application.prototype.print = function () {
        if (this.right instanceof Application) {
            return this.left.print() + " (" + this.right.print() + ")";
        }
        return this.left.print() + " " + this.right.print();
    };
    Application.prototype.freeVarName = function (bound) {
        return this.left.freeVarName(bound) || this.right.freeVarName(bound);
    };
    return Application;
}());
exports.Application = Application;
