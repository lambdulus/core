"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NormalEvaluator = void 0;
const visitors_1 = require("../visitors");
const freevarsfinder_1 = require("../visitors/freevarsfinder");
const ast_1 = require("../ast");
const boundingfinder_1 = require("../visitors/boundingfinder");
const reducers_1 = require("../reducers");
const reductions_1 = require("../reductions");
class NormalEvaluator extends visitors_1.ASTVisitor {
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
        if (application.left instanceof ast_1.Variable) {
            this.parent = application;
            this.child = ast_1.Child.Right;
            application.right.visit(this);
        }
        else if (application.left instanceof ast_1.Lambda) {
            const freeVarsFinder = new freevarsfinder_1.FreeVarsFinder(application.right);
            const freeVars = freeVarsFinder.freeVars;
            const boundingFinder = new boundingfinder_1.BoundingFinder(application.left, freeVars);
            const lambdas = boundingFinder.lambdas;
            if (lambdas.size) {
                this.nextReduction = new reductions_1.Alpha(lambdas);
            }
            else {
                this.nextReduction = new reductions_1.Beta(application, this.parent, this.child, application.left.body, application.left.argument.name(), application.right);
            }
        }
        // (this.left instanceof Macro || this.left instanceof ChurchNumeral || this.left instanceof Application)
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
exports.NormalEvaluator = NormalEvaluator;
