"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
class Eta extends _1.ASTReduction {
    constructor(parent, treeSide, // na jaky strane pro parenta je redukovanej uzel
    target) {
        super();
        this.parent = parent;
        this.treeSide = treeSide;
        this.target = target;
    }
}
exports.Eta = Eta;
