"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
class Expansion extends _1.ASTReduction {
    constructor(parent, treeSide, target) {
        super();
        this.parent = parent;
        this.treeSide = treeSide;
        this.target = target;
    }
}
exports.Expansion = Expansion;
