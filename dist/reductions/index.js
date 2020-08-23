"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var alpha_1 = require("./alpha");
exports.Alpha = alpha_1.Alpha;
var beta_1 = require("./beta");
exports.Beta = beta_1.Beta;
var expansion_1 = require("./expansion");
exports.Expansion = expansion_1.Expansion;
var eta_1 = require("./eta");
exports.Eta = eta_1.Eta;
var none_1 = require("./none");
exports.None = none_1.None;
// export { Gama, arity } from './gama' // To Be Deleted
var ASTReductionType;
(function (ASTReductionType) {
    ASTReductionType[ASTReductionType["ALPHA"] = 0] = "ALPHA";
    ASTReductionType[ASTReductionType["BETA"] = 1] = "BETA";
    ASTReductionType[ASTReductionType["EXPANSION"] = 2] = "EXPANSION";
    ASTReductionType[ASTReductionType["ETA"] = 3] = "ETA";
    ASTReductionType[ASTReductionType["NONE"] = 4] = "NONE";
    ASTReductionType[ASTReductionType["GAMA"] = 5] = "GAMA";
})(ASTReductionType = exports.ASTReductionType || (exports.ASTReductionType = {}));
