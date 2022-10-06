"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FreeVarsFinder = void 0;
const _1 = require(".");
class FreeVarsFinder extends _1.ASTVisitor {
    constructor(tree) {
        super();
        this.tree = tree;
        this.bound = new Set;
        this.freeVars = new Set;
        tree.visit(this);
    }
    onApplication(application) {
        application.left.visit(this);
        application.right.visit(this);
    }
    onLambda(lambda) {
        this.bound.add(lambda.argument.name());
        lambda.body.visit(this);
        this.bound.delete(lambda.argument.name());
    }
    onVariable(variable) {
        if (!this.bound.has(variable.name())) {
            this.freeVars.add(variable.name());
        }
    }
}
exports.FreeVarsFinder = FreeVarsFinder;
