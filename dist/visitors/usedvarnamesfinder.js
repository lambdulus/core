"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsedVarNamesFinder = void 0;
const _1 = require(".");
class UsedVarNamesFinder extends _1.ASTVisitor {
    constructor(tree) {
        super();
        this.tree = tree;
        this.used = new Set;
        tree.visit(this);
    }
    onApplication(application) {
        application.left.visit(this);
        application.right.visit(this);
    }
    onLambda(lambda) {
        lambda.argument.visit(this);
        lambda.body.visit(this);
    }
    onVariable(variable) {
        this.used.add(variable.name());
    }
}
exports.UsedVarNamesFinder = UsedVarNamesFinder;
