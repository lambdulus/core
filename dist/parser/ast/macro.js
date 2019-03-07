"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Macro = /** @class */ (function () {
    function Macro(token, definition) {
        this.token = token;
        this.definition = definition;
        this.identifier = Symbol();
    }
    Macro.prototype.name = function () {
        return "" + this.token.value;
    };
    Macro.prototype.clone = function () {
        return new Macro(this.token, this.definition);
    };
    Macro.prototype.visit = function (visitor) {
        visitor.onMacro(this);
    };
    Macro.prototype.expand = function () {
        // TODO: here I lose token - useful for location and origin of macro - should solve this
        // also consider not clonning
        return this.definition.ast.clone();
    };
    Macro.prototype.alphaConvert = function (oldName, newName) {
        return this;
    };
    Macro.prototype.betaReduce = function (argName, value) {
        return this;
    };
    Macro.prototype.etaConvert = function () {
        throw new Error("Method not implemented.");
    };
    Macro.prototype.freeVarName = function (bound) {
        return null;
    };
    return Macro;
}());
exports.Macro = Macro;
