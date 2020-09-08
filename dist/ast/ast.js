"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AST = exports.Child = void 0;
const basicprinter_1 = require("../visitors/basicprinter");
var Child;
(function (Child) {
    Child["Left"] = "left";
    Child["Right"] = "right";
})(Child = exports.Child || (exports.Child = {}));
class AST {
    toString() {
        const printer = new basicprinter_1.BasicPrinter(this);
        return printer.print();
    }
}
exports.AST = AST;
