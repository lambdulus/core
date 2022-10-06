"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicPrinter = void 0;
const ast_1 = require("../ast");
const _1 = require(".");
class BasicPrinter extends _1.ASTVisitor {
    constructor(tree) {
        super();
        this.tree = tree;
        this.expression = '';
        this.tree.visit(this);
    }
    printMultilambda(lambda, accumulator) {
        if (lambda.body instanceof ast_1.Lambda) {
            this.printMultilambda(lambda.body, `${accumulator} ${lambda.body.argument.name()}`);
        }
        else {
            this.expression += accumulator + ` . `;
            lambda.body.visit(this);
        }
    }
    print() {
        return this.expression;
    }
    // TODO: try to refactor this
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
    // TODO: try to refactor this
    onLambda(lambda) {
        if (lambda.body instanceof ast_1.Lambda) {
            this.expression += `(λ `;
            this.printMultilambda(lambda, lambda.argument.name());
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
    onChurchNumeral(churchNumeral) {
        this.expression += churchNumeral.name();
    }
    onMacro(macro) {
        this.expression += macro.name();
    }
    onVariable(variable) {
        this.expression += variable.name();
    }
}
exports.BasicPrinter = BasicPrinter;
