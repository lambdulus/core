"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ast_1 = require("../ast");
const visitors_1 = require("../visitors");
class BetaReducer extends visitors_1.ASTVisitor {
    constructor({ parent, treeSide, target, argName, value }, tree) {
        super();
        this.tree = tree;
        this.substituted = null;
        this.parent = parent;
        this.treeSide = treeSide;
        this.target = target;
        this.argName = argName;
        this.value = value;
        this.tree = tree;
    }
    onApplication(application) {
        application.left.visit(this);
        const left = this.substituted;
        application.right.visit(this);
        const right = this.substituted;
        this.substituted = new ast_1.Application(left, right);
    }
    onLambda(lambda) {
        if (lambda.argument.name() === this.argName) {
            this.substituted = lambda;
        }
        else {
            lambda.body.visit(this);
            const body = this.substituted;
            // TODO: clone or not clone ? i'd say CLONE but consider not clonning
            this.substituted = new ast_1.Lambda(lambda.argument.clone(), body);
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
    perform() {
        this.target.visit(this);
        if (this.parent === null) {
            this.tree = this.substituted;
        }
        else {
            this.parent[this.treeSide] = this.substituted;
        }
    }
}
exports.BetaReducer = BetaReducer;
