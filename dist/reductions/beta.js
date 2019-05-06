"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
// TODO: vyresit pro pripady kdy jde o multilambdu
// pak bude navic drzet mnozinu values a mnozinu arguments
// spis mnozinu tuples
class Beta extends _1.ASTReduction {
    constructor(redex, parent, treeSide, // na jaky strane pro parenta je redukovanej uzel
    target, // EXPR ve kterem se provede nahrada
    argName, value) {
        super();
        this.redex = redex;
        this.parent = parent;
        this.treeSide = treeSide;
        this.target = target;
        this.argName = argName;
        this.value = value;
    }
}
exports.Beta = Beta;
