"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lexer_1 = __importDefault(require("../../lexer"));
var __1 = require("..");
var ChurchNumber = /** @class */ (function () {
    function ChurchNumber(token) {
        this.token = token;
        this.identifier = Symbol();
    }
    ChurchNumber.prototype.name = function () {
        return "" + this.token.value;
    };
    ChurchNumber.prototype.clone = function () {
        return new ChurchNumber(this.token);
    };
    ChurchNumber.prototype.visit = function (visitor) {
        visitor.onChurchNumber(this);
    };
    ChurchNumber.prototype.expand = function () {
        var codeStyle = { singleLetterVars: true, lambdaLetters: ['λ'] };
        var value = this.token.value;
        var churchLiteral = "(\u03BB s z ." + ' (s'.repeat(value) + " z)" + ')'.repeat(value);
        return __1.parse(lexer_1.default.tokenize(churchLiteral, codeStyle));
    };
    ChurchNumber.prototype.alphaConvert = function (oldName, newName) {
        return this;
    };
    ChurchNumber.prototype.betaReduce = function (argName, value) {
        return this;
    };
    ChurchNumber.prototype.etaConvert = function () {
        throw new Error("Method not implemented.");
    };
    ChurchNumber.prototype.freeVarName = function (bound) {
        return null;
    };
    return ChurchNumber;
}());
exports.ChurchNumber = ChurchNumber;
