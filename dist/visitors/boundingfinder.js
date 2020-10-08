"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoundingFinder = void 0;
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
        const unbounds = new Set(this.unboundVars);
        let combined = new Set;
        application.left.visit(this);
        combined = new Set([...combined.values(), ...this.unboundVars.values()]);
        this.unboundVars = unbounds;
        application.right.visit(this);
        combined = new Set([...combined.values(), ...this.unboundVars.values()]);
        this.unboundVars = combined;
    }
    onLambda(lambda) {
        if (lambda.argument.name() === this.argName) {
            return;
        }
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
