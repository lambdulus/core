"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// TODO: vyresit pro pripady kdy jde o multilambdu
// pak bude navic drzet mnozinu values a mnozinu arguments
// spis mnozinu tuples
// mozna ani vicekrokovou Betu delat nikdy nebudu
class Beta {
    constructor(redex, parent, treeSide, // na jaky strane pro parenta je redukovanej uzel
    target, // EXPR ve kterem se provede nahrada
    argName, value) {
        this.redex = redex;
        this.parent = parent;
        this.treeSide = treeSide;
        this.target = target;
        this.argName = argName;
        this.value = value;
    }
}
exports.Beta = Beta;
