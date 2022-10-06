"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VarBindFinder = void 0;
const ast_1 = require("../ast");
const _1 = require(".");
// TODO: mozna vubec nebude potreba -> DELETE
class VarBindFinder extends _1.ASTVisitor {
    constructor(tree, varName) {
        super();
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
}
exports.VarBindFinder = VarBindFinder;
