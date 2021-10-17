"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicativeEvaluator = void 0;
const visitors_1 = require("../visitors");
const freevarsfinder_1 = require("../visitors/freevarsfinder");
const ast_1 = require("../ast");
const boundingfinder_1 = require("../visitors/boundingfinder");
const reducers_1 = require("../reducers");
const reductions_1 = require("../reductions");
class ApplicativeEvaluator extends visitors_1.ASTVisitor {
    constructor(tree) {
        super();
        this.tree = tree;
        this.parent = null;
        this.child = null;
        this.nextReduction = new reductions_1.None;
        this.tree.visit(this);
        // if (this.nextReduction instanceof None) {
        //   const normal : OptimizeEvaluator = new OptimizeEvaluator(tree)
        //   this.nextReduction = normal.nextReduction
        //   this.reducer = constructFor(tree, this.nextReduction)
        // }
        // else {
        //   this.reducer = constructFor(tree, this.nextReduction)
        // }
        this.reducer = (0, reducers_1.constructFor)(tree, this.nextReduction);
    }
    onApplication(application) {
        if (application.left instanceof ast_1.Lambda) {
            const parent = this.parent;
            const child = this.child;
            // first reduce argument
            this.parent = application;
            this.child = ast_1.Child.Right;
            application.right.visit(this);
            if (this.nextReduction instanceof reductions_1.None) {
                // argument is in normal form
                const freeVarsFinder = new freevarsfinder_1.FreeVarsFinder(application.right);
                const freeVars = freeVarsFinder.freeVars;
                const boundingfinder = new boundingfinder_1.BoundingFinder(application.left, freeVars);
                const lambdas = boundingfinder.lambdas;
                if (lambdas.size) {
                    this.nextReduction = new reductions_1.Alpha(lambdas);
                }
                else {
                    this.nextReduction = new reductions_1.Beta(application, parent, child, application.left.body, application.left.argument.name(), application.right);
                }
            }
        }
        else if (application.left instanceof ast_1.Application) {
            this.parent = application;
            this.child = ast_1.Child.Left;
            application.left.visit(this);
            if (this.nextReduction instanceof reductions_1.None) {
                this.parent = application;
                this.child = ast_1.Child.Right;
                application.right.visit(this);
            }
        }
        // (application.left instanceof Macro || application.left instanceof ChurchNumeral || application.left instanceof Variable)
        else {
            this.parent = application;
            this.child = ast_1.Child.Right;
            application.right.visit(this);
            if (this.nextReduction instanceof reductions_1.None) {
                this.parent = application;
                this.child = ast_1.Child.Left;
                application.left.visit(this);
            }
        }
    }
    onLambda(lambda) {
        // TODO: just experimenting
        // this.nextReduction = new None
        this.parent = lambda;
        this.child = ast_1.Child.Right;
        lambda.body.visit(this);
    }
    onChurchNumeral(churchNumeral) {
        this.nextReduction = new reductions_1.Expansion(this.parent, this.child, churchNumeral);
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
exports.ApplicativeEvaluator = ApplicativeEvaluator;
