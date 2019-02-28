"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parser_1 = require("../parser");
var Macro = /** @class */ (function () {
    function Macro(token, definition) {
        this.token = token;
        this.definition = definition;
    }
    Macro.prototype.name = function () {
        return "" + this.token.value;
    };
    Macro.prototype.clone = function () {
        return new Macro(this.token, this.definition);
    };
    Macro.prototype.reduceNormal = function () {
        return { tree: this.expand(), reduced: true, reduction: parser_1.Reduction.expansion, currentSubtree: this };
    };
    Macro.prototype.expand = function () {
        // TODO: here I lose token - useful for location and origin of macro - should solve this
        return this.definition.ast.clone();
    };
    Macro.prototype.reduceApplicative = function () {
        throw new Error("Method not implemented.");
    };
    Macro.prototype.alphaConvert = function (oldName, newName) {
        return this;
    };
    Macro.prototype.betaReduce = function (argName, value) {
        return this; // TODO: not clonning? IDK
    };
    Macro.prototype.etaConvert = function () {
        throw new Error("Method not implemented.");
    };
    Macro.prototype.print = function () {
        return this.name();
    };
    Macro.prototype.freeVarName = function (bound) {
        return null;
    };
    return Macro;
}());
exports.Macro = Macro;
