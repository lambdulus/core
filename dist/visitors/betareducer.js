"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const application_1 = require("../parser/ast/application");
const lambda_1 = require("../parser/ast/lambda");
class BetaReducer {
    constructor({ parent, treeSide, target, argName, value }, tree) {
        this.substituted = null;
        this.argName = argName;
        this.value = value;
        target.visit(this);
        if (parent === null) {
            this.tree = this.substituted;
        }
        else {
            parent[treeSide] = this.substituted;
            this.tree = tree;
        }
    }
    onApplication(application) {
        application.left.visit(this);
        const left = this.substituted;
        application.right.visit(this);
        const right = this.substituted;
        this.substituted = new application_1.Application(left, right);
    }
    onLambda(lambda) {
        if (lambda.argument.name() === this.argName) {
            this.substituted = lambda;
        }
        else {
            lambda.body.visit(this);
            const body = this.substituted;
            // TODO: clone or not clone ? i'd say CLONE but consider not clonning
            this.substituted = new lambda_1.Lambda(lambda.argument.clone(), body);
        }
    }
    onChurchNumber(churchNumber) {
        this.substituted = churchNumber;
    }
    onMacro(macro) {
        this.substituted = macro;
    }
    onVariable(variable) {
        if (variable.name() === this.argName) {
            this.substituted = this.value.clone();
        }
        else {
            this.substituted = variable;
        }
    }
}
exports.BetaReducer = BetaReducer;
