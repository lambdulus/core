"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Child;
(function (Child) {
    Child["Left"] = "left";
    Child["Right"] = "right";
})(Child = exports.Child || (exports.Child = {}));
var NextAlpha = /** @class */ (function () {
    function NextAlpha(tree, child, oldName, newName) {
        this.tree = tree;
        this.child = child;
        this.oldName = oldName;
        this.newName = newName;
    }
    NextAlpha.prototype.visit = function (visitor) {
        visitor.onAlpha(this);
    };
    return NextAlpha;
}());
exports.NextAlpha = NextAlpha;
var NextBeta = /** @class */ (function () {
    function NextBeta(parent, treeSide, // na jaky strane pro parenta je redukovanej uzel
    target, // EXPR ve kterem se provede nahrada
    argName, value) {
        this.parent = parent;
        this.treeSide = treeSide;
        this.target = target;
        this.argName = argName;
        this.value = value;
    }
    NextBeta.prototype.visit = function (visitor) {
        visitor.onBeta(this);
    };
    return NextBeta;
}());
exports.NextBeta = NextBeta;
// TODO: vyresit pro pripady kdy jde o multilambdu
// pak bude navic drzet mnozinu values a mnozinu arguments
// spis mnozinu tuples
var NextExpansion = /** @class */ (function () {
    function NextExpansion(parent, treeSide, tree) {
        this.parent = parent;
        this.treeSide = treeSide;
        this.tree = tree;
    }
    NextExpansion.prototype.visit = function (visitor) {
        visitor.onExpansion(this);
    };
    return NextExpansion;
}());
exports.NextExpansion = NextExpansion;
var NextNone = /** @class */ (function () {
    function NextNone() {
    }
    NextNone.prototype.visit = function (visitor) {
        visitor.onNone(this);
    };
    return NextNone;
}());
exports.NextNone = NextNone;
// TODO: what the heck? :D
var Visitor = /** @class */ (function () {
    function Visitor() {
    }
    return Visitor;
}());
exports.Visitor = Visitor;
