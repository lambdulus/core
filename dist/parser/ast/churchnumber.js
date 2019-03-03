"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lexer_1 = __importDefault(require("../../lexer"));
var parser_1 = require("../parser");
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
    ChurchNumber.prototype.nextNormal = function (parent, child) {
        return new parser_1.NextExpansion(parent, child, this);
    };
    ChurchNumber.prototype.reduceNormal = function () {
        return { tree: this.expand(), reduced: true, reduction: parser_1.Reduction.Expansion, currentSubtree: this };
    };
    ChurchNumber.prototype.expand = function () {
        var codeStyle = { singleLetterVars: true, lambdaLetters: ['λ'] };
        var value = this.token.value;
        var churchLiteral = "(\u03BB s z ." + ' (s'.repeat(value) + " z)" + ')'.repeat(value);
        return parser_1.parse(lexer_1.default.tokenize(churchLiteral, codeStyle));
    };
    ChurchNumber.prototype.reduceApplicative = function () {
        throw new Error("Method not implemented.");
    };
    ChurchNumber.prototype.alphaConvert = function (oldName, newName) {
        return this;
    };
    ChurchNumber.prototype.betaReduce = function (argName, value) {
        return this; // TODO: not clonning? IDK
    };
    ChurchNumber.prototype.etaConvert = function () {
        throw new Error("Method not implemented.");
    };
    ChurchNumber.prototype.print = function () {
        return this.name();
    };
    ChurchNumber.prototype.freeVarName = function (bound) {
        return null;
    };
    return ChurchNumber;
}());
exports.ChurchNumber = ChurchNumber;
