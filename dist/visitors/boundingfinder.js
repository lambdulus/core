"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
class BoundingFinder extends _1.ASTVisitor {
    constructor(tree, freeVars) {
        super();
        this.tree = tree;
        this.freeVars = freeVars;
        this.lambdas = new Set;
        this.unboundVars = new Set;
        this.argName = tree.argument.name();
        tree.body.visit(this);
    }
    onApplication(application) {
        const unbounds = this.unboundVars;
        application.left.visit(this);
        this.unboundVars = unbounds;
        application.right.visit(this);
        this.unboundVars = unbounds;
    }
    onLambda(lambda) {
        lambda.body.visit(this);
        this.unboundVars.delete(lambda.argument.name()); // binding argument name
        if (this.unboundVars.has(this.argName)
            &&
                this.freeVars.has(lambda.argument.name())) {
            this.lambdas.add(lambda);
        }
    }
    onVariable(variable) {
        this.unboundVars.add(variable.name());
    }
}
exports.BoundingFinder = BoundingFinder;
