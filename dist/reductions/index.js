"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ASTReductionType = exports.Gama = exports.None = exports.Eta = exports.Expansion = exports.Beta = exports.Alpha = void 0;
var alpha_1 = require("./alpha");
Object.defineProperty(exports, "Alpha", { enumerable: true, get: function () { return alpha_1.Alpha; } });
var beta_1 = require("./beta");
Object.defineProperty(exports, "Beta", { enumerable: true, get: function () { return beta_1.Beta; } });
var expansion_1 = require("./expansion");
Object.defineProperty(exports, "Expansion", { enumerable: true, get: function () { return expansion_1.Expansion; } });
var eta_1 = require("./eta");
Object.defineProperty(exports, "Eta", { enumerable: true, get: function () { return eta_1.Eta; } });
var none_1 = require("./none");
Object.defineProperty(exports, "None", { enumerable: true, get: function () { return none_1.None; } });
var gama_1 = require("./gama");
Object.defineProperty(exports, "Gama", { enumerable: true, get: function () { return gama_1.Gama; } });
var ASTReductionType;
(function (ASTReductionType) {
    ASTReductionType[ASTReductionType["ALPHA"] = 0] = "ALPHA";
    ASTReductionType[ASTReductionType["BETA"] = 1] = "BETA";
    ASTReductionType[ASTReductionType["EXPANSION"] = 2] = "EXPANSION";
    ASTReductionType[ASTReductionType["ETA"] = 3] = "ETA";
    ASTReductionType[ASTReductionType["NONE"] = 4] = "NONE";
    ASTReductionType[ASTReductionType["GAMA"] = 5] = "GAMA";
})(ASTReductionType = exports.ASTReductionType || (exports.ASTReductionType = {}));
