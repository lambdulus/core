"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gama = void 0;
const _1 = require(".");
class Gama {
    constructor(redexes, // TODO: consider redexes : List<Application>
    args, parent, treeSide, // na jaky strane pro parenta je redukovanej uzel
    abstraction) {
        this.redexes = redexes;
        this.args = args;
        this.parent = parent;
        this.treeSide = treeSide;
        this.abstraction = abstraction;
        this.type = _1.ASTReductionType.GAMA;
    }
}
exports.Gama = Gama;
