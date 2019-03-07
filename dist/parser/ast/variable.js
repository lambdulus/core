"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lexer_1 = require("../../lexer");
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
    // nextNormal (parent : Binary | null, child : Child | null) : NextReduction {
    //   return new NextNone
    // }
    // reduceNormal () : ReductionResult {
    //   return { tree : this, reduced : false, reduction : Reduction.None, currentSubtree : this }
    // }
    // reduceApplicative () : ReductionResult {
    //   throw new Error("Method not implemented.");
    // }
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
    // print () : string {
    //   return this.name()
    // }
    Variable.prototype.freeVarName = function (bound) {
        if (bound.includes(this.name())) {
            return null;
        }
        return this.name();
    };
    return Variable;
}());
exports.Variable = Variable;
