"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
