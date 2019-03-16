"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ast_1 = require("../ast");
// TODO: mozna vubec nebude potreba -> DELETE
class VarBindFinder {
    constructor(tree, varName) {
        this.tree = tree;
        this.varName = varName;
        this.lambda = null;
        tree.visit(this);
    }
    onApplication(application) {
        // nothing  
    }
    onLambda(lambda) {
        if (lambda.argument.name() === this.varName) {
            this.lambda = lambda;
        }
        else if (lambda.body instanceof ast_1.Lambda) {
            lambda.body.visit(this);
        }
    }
    onChurchNumber(churchNumber) {
        // nothing
    }
    onMacro(macro) {
        // nothing
    }
    onVariable(variable) {
        // nothing
    }
}
exports.VarBindFinder = VarBindFinder;
