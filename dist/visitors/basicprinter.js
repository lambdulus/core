"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ast_1 = require("../ast");
const _1 = require(".");
class BasicPrinter extends _1.ASTVisitor {
    constructor(tree) {
        super();
        this.tree = tree;
        this.expression = '';
        this.tree.visit(this);
    }
    // TODO: this looks like nonsense
    // maybe solve it with another Visitor
    printLambdaBody(lambda) {
        if (lambda.body instanceof ast_1.Lambda) {
            this.printLambdaBody(lambda.body);
        }
        else {
            lambda.body.visit(this);
        }
    }
    // TODO: this looks like nonsense
    // maybe solve it with another Visitor
    printLambdaArguments(lambda, accumulator) {
        if (lambda.body instanceof ast_1.Lambda) {
            this.printLambdaArguments(lambda.body, `${accumulator} ${lambda.body.argument.name()}`);
        }
        else {
            this.expression += accumulator;
        }
    }
    print() {
        return this.expression;
    }
    // TODO: this is ugly as hell
    onApplication(application) {
        if (application.right instanceof ast_1.Application) {
            application.left.visit(this);
            this.expression += ` (`;
            application.right.visit(this);
            this.expression += `)`;
        }
        else {
            application.left.visit(this);
            this.expression += ` `;
            application.right.visit(this);
        }
    }
    // TODO: this is ugly as hell
    onLambda(lambda) {
        if (lambda.body instanceof ast_1.Lambda) {
            this.expression += `(λ `;
            this.printLambdaArguments(lambda, lambda.argument.name());
            this.expression += ` . `;
            this.printLambdaBody(lambda);
            this.expression += `)`;
        }
        else {
            this.expression += `(λ `;
            lambda.argument.visit(this);
            this.expression += ` . `;
            lambda.body.visit(this);
            this.expression += `)`;
        }
    }
    onChurchNumber(churchNumber) {
        this.expression += churchNumber.name();
    }
    onMacro(macro) {
        this.expression += macro.name();
    }
    onVariable(variable) {
        this.expression += variable.name();
    }
}
exports.BasicPrinter = BasicPrinter;
