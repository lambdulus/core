"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptimizeEvaluator = void 0;
const visitors_1 = require("../visitors");
const freevarsfinder_1 = require("../visitors/freevarsfinder");
const ast_1 = require("../ast");
// import { BoundingFinder } from "./boundingfinder"
const reducers_1 = require("../reducers");
const reductions_1 = require("../reductions");
const eta_1 = require("../reductions/eta");
class OptimizeEvaluator extends visitors_1.ASTVisitor {
    constructor(tree) {
        super();
        this.tree = tree;
        this.parent = null;
        this.child = null;
        this.nextReduction = new reductions_1.None;
        this.tree.visit(this);
        this.reducer = (0, reducers_1.constructFor)(tree, this.nextReduction);
    }
    onApplication(application) {
        this.parent = application;
        this.child = ast_1.Child.Left;
        application.left.visit(this);
        if (this.nextReduction instanceof reductions_1.None) {
            this.parent = application;
            this.child = ast_1.Child.Right;
            application.right.visit(this);
        }
    }
    onLambda(lambda) {
        if (lambda.right instanceof ast_1.Application
            &&
                lambda.right.right instanceof ast_1.Variable
            &&
                lambda.right.right.name() === lambda.left.name()) {
            const freeVarsFinder = new freevarsfinder_1.FreeVarsFinder(lambda.right.left);
            const freeVars = freeVarsFinder.freeVars;
            if (!freeVars.has(lambda.left.name())) {
                this.nextReduction = new eta_1.Eta(this.parent, this.child, lambda.right.left);
                return;
            }
        }
        this.parent = lambda;
        this.child = ast_1.Child.Right;
        lambda.body.visit(this);
    }
    perform() {
        this.reducer.perform();
        return this.reducer.tree;
    }
}
exports.OptimizeEvaluator = OptimizeEvaluator;
