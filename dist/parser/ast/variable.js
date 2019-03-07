"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lexer_1 = require("../../lexer");
var parser_1 = require("../parser");
var Variable = /** @class */ (function () {
    function Variable(token) {
        this.token = token;
        this.identifier = Symbol();
    }
    Variable.prototype.name = function () {
        return "" + this.token.value;
    };
    Variable.prototype.clone = function () {
        return new Variable(this.token);
    };
    Variable.prototype.visit = function (visitor) {
        visitor.onVariable(this);
    };
    Variable.prototype.nextNormal = function (parent, child) {
        return new parser_1.NextNone;
    };
    Variable.prototype.reduceNormal = function () {
        return { tree: this, reduced: false, reduction: parser_1.Reduction.None, currentSubtree: this };
    };
    Variable.prototype.reduceApplicative = function () {
        throw new Error("Method not implemented.");
    };
    Variable.prototype.alphaConvert = function (oldName, newName) {
        if (this.name() === oldName) {
            var token = new lexer_1.Token(this.token.type, newName, this.token.position);
            return new Variable(token);
        }
        return this;
    };
    Variable.prototype.betaReduce = function (argName, value) {
        if (this.name() === argName) {
            return value.clone();
        }
        return this;
    };
    Variable.prototype.etaConvert = function () {
        throw new Error("Method not implemented.");
    };
    Variable.prototype.print = function () {
        return this.name();
    };
    Variable.prototype.freeVarName = function (bound) {
        if (bound.includes(this.name())) {
            return null;
        }
        return this.name();
    };
    return Variable;
}());
exports.Variable = Variable;
