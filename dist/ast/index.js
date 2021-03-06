"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Variable = exports.Macro = exports.ChurchNumeral = exports.Lambda = exports.Application = exports.AST = exports.Child = void 0;
var ast_1 = require("./ast");
Object.defineProperty(exports, "Child", { enumerable: true, get: function () { return ast_1.Child; } });
Object.defineProperty(exports, "AST", { enumerable: true, get: function () { return ast_1.AST; } });
var application_1 = require("./application");
Object.defineProperty(exports, "Application", { enumerable: true, get: function () { return application_1.Application; } });
var lambda_1 = require("./lambda");
Object.defineProperty(exports, "Lambda", { enumerable: true, get: function () { return lambda_1.Lambda; } });
var churchnumeral_1 = require("./churchnumeral");
Object.defineProperty(exports, "ChurchNumeral", { enumerable: true, get: function () { return churchnumeral_1.ChurchNumeral; } });
var macro_1 = require("./macro");
Object.defineProperty(exports, "Macro", { enumerable: true, get: function () { return macro_1.Macro; } });
var variable_1 = require("./variable");
Object.defineProperty(exports, "Variable", { enumerable: true, get: function () { return variable_1.Variable; } });
