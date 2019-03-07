"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lambda_1 = require("../parser/ast/lambda");
var variable_1 = require("../parser/ast/variable");
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
    return NextExpansion;
}());
exports.NextExpansion = NextExpansion;
var NextNone = /** @class */ (function () {
    function NextNone() {
    }
    return NextNone;
}());
exports.NextNone = NextNone;
var NormalEvaluation = /** @class */ (function () {
    function NormalEvaluation(tree) {
        this.tree = tree;
        this.parent = null;
        this.child = null;
        this.nextReduction = NextNone;
        this.tree.visit(this);
    }
    NormalEvaluation.prototype.evaluate = function () {
        if (this.nextReduction instanceof NextAlpha) {
            var _a = this.nextReduction, tree = _a.tree, child = _a.child, oldName = _a.oldName, newName = _a.newName;
            tree[child] = tree[child].alphaConvert(oldName, newName);
            return this.tree;
        }
        else if (this.nextReduction instanceof NextBeta) {
            var _b = this.nextReduction, parent_1 = _b.parent, treeSide = _b.treeSide, target = _b.target, argName = _b.argName, value = _b.value;
            var substituted = target.betaReduce(argName, value);
            if (parent_1 === null) {
                return substituted;
            }
            else {
                parent_1[treeSide] = substituted;
                return this.tree;
            }
        }
        else if (this.nextReduction instanceof NextExpansion) {
            var _c = this.nextReduction, parent_2 = _c.parent, treeSide = _c.treeSide, tree = _c.tree;
            var expanded = tree.expand();
            if (parent_2 === null) {
                return expanded;
            }
            else {
                parent_2[treeSide] = expanded;
                return this.tree;
            }
        }
        else { // instanceof NextNone
            return this.tree;
        }
    };
    NormalEvaluation.prototype.onApplication = function (application) {
        if (application.left instanceof variable_1.Variable) {
            this.parent = application;
            this.child = Child.Right;
            application.right.visit(this);
        }
        else if (application.left instanceof lambda_1.Lambda) {
            var freeVar = application.right.freeVarName([]);
            if (freeVar && application.left.isBound(freeVar) && application.left.argument.name() !== freeVar) {
                // TODO: refactor condition PLS it looks awful
                // second third mainly
                // TODO: find truly original non conflicting new name probably using number postfixes
                this.nextReduction = new NextAlpha(application, Child.Left, freeVar, "_" + freeVar);
            }
            else {
                // search for free Vars in right which are bound in left OK
                // if any, do α conversion and return
                // if none, do β reduction and return
                this.nextReduction = new NextBeta(this.parent, this.child, application.left.body, application.left.argument.name(), application.right);
            }
        }
        else { // (this.left instanceof Macro || this.left instanceof ChurchNumber)
            this.parent = application;
            this.child = Child.Left;
            application.left.visit(this);
        }
    };
    NormalEvaluation.prototype.onLambda = function (lambda) {
        this.parent = lambda;
        this.child = Child.Right;
        lambda.body.visit(this);
    };
    NormalEvaluation.prototype.onChurchNumber = function (churchNumber) {
        this.nextReduction = new NextExpansion(this.parent, this.child, churchNumber);
    };
    NormalEvaluation.prototype.onMacro = function (macro) {
        this.nextReduction = new NextExpansion(this.parent, this.child, macro);
    };
    NormalEvaluation.prototype.onVariable = function (variable) {
        this.nextReduction = new NextNone;
    };
    return NormalEvaluation;
}());
exports.NormalEvaluation = NormalEvaluation;
