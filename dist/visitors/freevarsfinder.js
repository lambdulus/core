"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FreeVarsFinder {
    constructor(tree) {
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
    }
    onChurchNumber(churchNumber) {
        // nothing
    }
    onMacro(macro) {
        // nothing
    }
    onVariable(variable) {
        if (!this.bound.has(variable.name())) {
            this.freeVars.add(variable.name());
        }
    }
}
exports.FreeVarsFinder = FreeVarsFinder;
