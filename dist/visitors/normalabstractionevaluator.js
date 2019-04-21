"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const freevarsfinder_1 = require("./freevarsfinder");
const ast_1 = require("../ast");
const boundingfinder_1 = require("./boundingfinder");
const reducers_1 = require("../reducers");
const reductions_1 = require("../reductions");
////////////////////////////////////////////////////////////
class NormalAbstractionEvaluator extends _1.ASTVisitor {
    constructor(tree) {
        super();
        this.tree = tree;
        this.parent = null;
        this.child = null;
        this.nextReduction = new reductions_1.None;
        this.tree.visit(this);
        this.reducer = reducers_1.constructFor(tree, this.nextReduction);
    }
    onApplication(application) {
        if (application.left instanceof ast_1.Variable) {
            this.parent = application;
            this.child = ast_1.Child.Right;
            application.right.visit(this);
        }
        else if (application.left instanceof ast_1.Lambda) {
            const freeVarsFinder = new freevarsfinder_1.FreeVarsFinder(application.right);
            const freeVars = freeVarsFinder.freeVars;
            const boundingfinder = new boundingfinder_1.BoundingFinder(application.left, freeVars);
            const lambdas = boundingfinder.lambdas;
            if (lambdas.size) {
                this.nextReduction = new reductions_1.Alpha(lambdas);
            }
            else {
                this.nextReduction = new reductions_1.Beta(this.parent, this.child, application.left.body, application.left.argument.name(), application.right);
            }
        }
        // (this.left instanceof Macro || this.left instanceof ChurchNumber || this.left instanceof Application)
        else {
            this.parent = application;
            this.child = ast_1.Child.Left;
            application.left.visit(this);
            if (this.nextReduction instanceof reductions_1.None) {
                this.parent = application;
                this.child = ast_1.Child.Right;
                application.right.visit(this);
            }
        }
    }
    onLambda(lambda) {
        this.parent = lambda;
        this.child = ast_1.Child.Right;
        lambda.body.visit(this);
    }
    onChurchNumber(churchNumber) {
        this.nextReduction = new reductions_1.Expansion(this.parent, this.child, churchNumber);
    }
    onMacro(macro) {
        this.nextReduction = new reductions_1.Expansion(this.parent, this.child, macro);
    }
    onVariable(variable) {
        this.nextReduction = new reductions_1.None;
    }
    perform() {
        this.reducer.perform();
        return this.reducer.tree;
    }
}
exports.NormalAbstractionEvaluator = NormalAbstractionEvaluator;