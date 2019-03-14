"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Child;
(function (Child) {
    Child["Left"] = "left";
    Child["Right"] = "right";
})(Child = exports.Child || (exports.Child = {}));
var Reductions;
(function (Reductions) {
    class ASTReduction {
    }
    Reductions.ASTReduction = ASTReduction;
    class Alpha extends ASTReduction {
        constructor(conversions) {
            super();
            this.conversions = conversions;
        }
    }
    Reductions.Alpha = Alpha;
    // TODO: vyresit pro pripady kdy jde o multilambdu
    // pak bude navic drzet mnozinu values a mnozinu arguments
    // spis mnozinu tuples
    class Beta extends ASTReduction {
        constructor(parent, treeSide, // na jaky strane pro parenta je redukovanej uzel
        target, // EXPR ve kterem se provede nahrada
        argName, value) {
            super();
            this.parent = parent;
            this.treeSide = treeSide;
            this.target = target;
            this.argName = argName;
            this.value = value;
        }
    }
    Reductions.Beta = Beta;
    class Expansion extends ASTReduction {
        constructor(parent, treeSide, target) {
            super();
            this.parent = parent;
            this.treeSide = treeSide;
            this.target = target;
        }
    }
    Reductions.Expansion = Expansion;
    class None extends ASTReduction {
    }
    Reductions.None = None;
})(Reductions = exports.Reductions || (exports.Reductions = {}));
class ASTVisitor {
    onApplication(application) { }
    onLambda(lambda) { }
    onChurchNumber(churchNumber) { }
    onMacro(macro) { }
    onVariable(variable) { }
}
exports.ASTVisitor = ASTVisitor;
