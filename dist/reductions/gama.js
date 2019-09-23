"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Gama {
    constructor(redexes, // TODO: consider redexes : List<Application>
    args, parent, treeSide, // na jaky strane pro parenta je redukovanej uzel
    abstraction
    // public readonly target : AST, // EXPR ve kterem se provede nahrada
    ) {
        this.redexes = redexes;
        this.args = args;
        this.parent = parent;
        this.treeSide = treeSide;
        this.abstraction = abstraction;
    }
}
exports.Gama = Gama;
