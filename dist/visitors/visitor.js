"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parser_1 = require("../parser/parser");
var application_1 = require("../parser/ast/application");
var lambda_1 = require("../parser/ast/lambda");
var variable_1 = require("../parser/ast/variable");
var BasicPrinter = /** @class */ (function () {
    function BasicPrinter(tree) {
        this.tree = tree;
        this.expression = '';
        this.tree.visit(this);
    }
    // TODO: this looks like nonsense
    BasicPrinter.prototype.printLambdaBody = function (lambda) {
        if (lambda.body instanceof lambda_1.Lambda) {
            this.printLambdaBody(lambda.body);
        }
        else {
            lambda.body.visit(this);
        }
    };
    // TODO: this looks like nonsense
    BasicPrinter.prototype.printLambdaArguments = function (lambda, accumulator) {
        if (lambda.body instanceof lambda_1.Lambda) {
            this.printLambdaArguments(lambda.body, accumulator + " " + lambda.body.argument.name());
        }
        else {
            this.expression += accumulator;
        }
    };
    BasicPrinter.prototype.print = function () {
        return this.expression;
    };
    // TODO: this is ugly as hell
    BasicPrinter.prototype.onApplication = function (application) {
        if (application.right instanceof application_1.Application) {
            application.left.visit(this);
            this.expression += " (";
            application.right.visit(this);
            this.expression += ")";
        }
        else {
            application.left.visit(this);
            this.expression += " ";
            application.right.visit(this);
        }
    };
    // TODO: this is ugly as hell
    BasicPrinter.prototype.onLambda = function (lambda) {
        if (lambda.body instanceof lambda_1.Lambda) {
            this.expression += "(\u03BB ";
            this.printLambdaArguments(lambda, lambda.argument.name());
            this.expression += " . ";
            this.printLambdaBody(lambda);
            this.expression += ")";
        }
        else {
            this.expression += "(\u03BB ";
            lambda.argument.visit(this);
            this.expression += " . ";
            lambda.body.visit(this);
            this.expression += ")";
        }
    };
    BasicPrinter.prototype.onChurchNumber = function (churchNumber) {
        this.expression += churchNumber.name();
    };
    BasicPrinter.prototype.onMacro = function (macro) {
        this.expression += macro.name();
    };
    BasicPrinter.prototype.onVariable = function (variable) {
        this.expression += variable.name();
    };
    return BasicPrinter;
}());
exports.BasicPrinter = BasicPrinter;
// TODO:
// myslenka: na kazdou iteraci stromu vytvorim novou instanci NormalEvaluation ?
// pokud ano - dostanu v konstruktoru strom
// pri redukci se muze zmenit root, tim se zmeni muj strom
// az se provede redukce tak si ode me muze vnejsi kod strom zase zpet vzit
// ulozit ho do statu v reactu nebo podobne
// v dalsi iteraci si ho zase vzit a znova iterovat
// jenze je to takovy dost haluz
// slo by to i jinak
// vytvorim jednu instanci na celou exekuci stromu
// ta si drzi strom a kdyz se zavola nextReduction () tak vrati nejakou strukturu s metadaty o redukci
// taky ma metodu na provedeni redukce
// i tohle reseni umozni vzit si strom zvenku a pomoci public getteru a private setteru budu moct strom menit jenom zevnitr
// v reactu si muzu drzet klidne celej tenhle Visitor, protoze proc ne
// pri redukci mi 
var NormalEvaluation = /** @class */ (function () {
    function NormalEvaluation(tree) {
        this.tree = tree;
        // some private prop, to work around classic recursion
        this.parent = null;
        this.child = null;
        this.nextReduction = parser_1.NextNone;
        this.tree.visit(this);
    }
    NormalEvaluation.prototype.evaluate = function () {
        if (this.nextReduction instanceof parser_1.NextAlpha) {
            var _a = this.nextReduction, tree = _a.tree, child = _a.child, oldName = _a.oldName, newName = _a.newName;
            tree[child] = tree[child].alphaConvert(oldName, newName);
            return this.tree;
        }
        else if (this.nextReduction instanceof parser_1.NextBeta) {
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
        else if (this.nextReduction instanceof parser_1.NextExpansion) {
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
            this.child = parser_1.Child.Right;
            application.right.visit(this);
        }
        else if (application.left instanceof lambda_1.Lambda) {
            var freeVar = application.right.freeVarName([]);
            if (freeVar && application.left.isBound(freeVar) && application.left.argument.name() !== freeVar) {
                // TODO: refactor condition PLS it looks awful
                // second third mainly
                // TODO: find truly original non conflicting new name probably using number postfixes
                this.nextReduction = new parser_1.NextAlpha(application, parser_1.Child.Left, freeVar, "_" + freeVar);
            }
            else {
                // search for free Vars in right which are bound in left OK
                // if any, do α conversion and return
                // if none, do β reduction and return
                this.nextReduction = new parser_1.NextBeta(this.parent, this.child, application.left.body, application.left.argument.name(), application.right);
            }
        }
        else { // (this.left instanceof Macro || this.left instanceof ChurchNumber)
            this.parent = application;
            this.child = parser_1.Child.Left;
            application.left.visit(this);
        }
    };
    NormalEvaluation.prototype.onLambda = function (lambda) {
        this.parent = lambda;
        this.child = parser_1.Child.Right;
        lambda.body.visit(this);
    };
    NormalEvaluation.prototype.onChurchNumber = function (churchNumber) {
        this.nextReduction = new parser_1.NextExpansion(this.parent, this.child, churchNumber);
    };
    NormalEvaluation.prototype.onMacro = function (macro) {
        this.nextReduction = new parser_1.NextExpansion(this.parent, this.child, macro);
    };
    NormalEvaluation.prototype.onVariable = function (variable) {
        this.nextReduction = new parser_1.NextNone;
    };
    return NormalEvaluation;
}());
exports.NormalEvaluation = NormalEvaluation;
