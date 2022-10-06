"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eta = void 0;
const _1 = require(".");
class Eta {
    constructor(parent, treeSide, // na jaky strane pro parenta je redukovanej uzel
    target) {
        this.parent = parent;
        this.treeSide = treeSide;
        this.target = target;
        this.type = _1.ASTReductionType.ETA;
    }
}
exports.Eta = Eta;
