"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Child;
(function (Child) {
    Child["Left"] = "left";
    Child["Right"] = "right";
})(Child = exports.Child || (exports.Child = {}));
class NextAlpha {
    constructor(tree, child, oldName, newName) {
        this.tree = tree;
        this.child = child;
        this.oldName = oldName;
        this.newName = newName;
    }
    visit(visitor) {
        visitor.onAlpha(this);
    }
}
exports.NextAlpha = NextAlpha;
class NextBeta {
    constructor(parent, treeSide, // na jaky strane pro parenta je redukovanej uzel
    target, // EXPR ve kterem se provede nahrada
    argName, value) {
        this.parent = parent;
        this.treeSide = treeSide;
        this.target = target;
        this.argName = argName;
        this.value = value;
    }
    visit(visitor) {
        visitor.onBeta(this);
    }
}
exports.NextBeta = NextBeta;
// TODO: vyresit pro pripady kdy jde o multilambdu
// pak bude navic drzet mnozinu values a mnozinu arguments
// spis mnozinu tuples
class NextExpansion {
    constructor(parent, treeSide, target) {
        this.parent = parent;
        this.treeSide = treeSide;
        this.target = target;
    }
    visit(visitor) {
        visitor.onExpansion(this);
    }
}
exports.NextExpansion = NextExpansion;
class NextNone {
    visit(visitor) {
        visitor.onNone(this);
    }
}
exports.NextNone = NextNone;
