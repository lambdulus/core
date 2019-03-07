"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lambda_1 = require("../parser/ast/lambda");
var application_1 = require("../parser/ast/application");
var BasicPrinter = /** @class */ (function () {
    function BasicPrinter(tree) {
        this.tree = tree;
        this.expression = '';
        this.tree.visit(this);
    }
    // TODO: this looks like nonsense
    // maybe solve it with another Visitor
    BasicPrinter.prototype.printLambdaBody = function (lambda) {
        if (lambda.body instanceof lambda_1.Lambda) {
            this.printLambdaBody(lambda.body);
        }
        else {
            lambda.body.visit(this);
        }
    };
    // TODO: this looks like nonsense
    // maybe solve it with another Visitor
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
