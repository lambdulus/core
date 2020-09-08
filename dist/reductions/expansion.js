"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Expansion = void 0;
const _1 = require(".");
class Expansion {
    constructor(parent, treeSide, target) {
        this.parent = parent;
        this.treeSide = treeSide;
        this.target = target;
        this.type = _1.ASTReductionType.EXPANSION;
    }
}
exports.Expansion = Expansion;
