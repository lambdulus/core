"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const freevarsfinder_1 = require("./freevarsfinder");
const variable_1 = require("../ast/variable");
const lambda_1 = require("../ast/lambda");
const boundingfinder_1 = require("./boundingfinder");
const reducerfactory_1 = require("../reducers/reducerfactory");
class NormalEvaluator extends _1.ASTVisitor {
    constructor(tree) {
        super();
        this.tree = tree;
        this.parent = null;
        this.child = null;
        this.nextReduction = new _1.Reductions.None;
        this.tree.visit(this);
        this.reducer = reducerfactory_1.ReducerFactory.constructFor(tree, this.nextReduction);
    }
    onApplication(application) {
        if (application.left instanceof variable_1.Variable) {
            // TODO: fakt to je jenom pokud to nalevo je Var?
            // co kdyz to nalevo neni var, ale nejde to nijak zjednodusit
            // nemel bych to nejak osetrit?
            // napis si na to nejakej TEST
            this.parent = application;
            this.child = _1.Child.Right;
            application.right.visit(this);
        }
        else if (application.left instanceof lambda_1.Lambda) {
            const freeVarsFinder = new freevarsfinder_1.FreeVarsFinder(application.right);
            console.log('freevarsfinder');
            const freeVars = freeVarsFinder.freeVars;
            const boundingfinder = new boundingfinder_1.BoundingFinder(application.left, freeVars);
            const lambdas = boundingfinder.lambdas;
            if (lambdas.size) {
                this.nextReduction = new _1.Reductions.Alpha(lambdas);
            }
            else {
                this.nextReduction = new _1.Reductions.Beta(this.parent, this.child, application.left.body, application.left.argument.name(), application.right);
            }
        }
        else { // (this.left instanceof Macro || this.left instanceof ChurchNumber)
            this.parent = application;
            this.child = _1.Child.Left;
            application.left.visit(this);
        }
    }
    onLambda(lambda) {
        this.parent = lambda;
        this.child = _1.Child.Right;
        lambda.body.visit(this);
    }
    onChurchNumber(churchNumber) {
        this.nextReduction = new _1.Reductions.Expansion(this.parent, this.child, churchNumber);
    }
    onMacro(macro) {
        this.nextReduction = new _1.Reductions.Expansion(this.parent, this.child, macro);
    }
    onVariable(variable) {
        this.nextReduction = new _1.Reductions.None;
    }
    perform() {
        this.reducer.perform();
        return this.reducer.tree;
    }
}
exports.NormalEvaluator = NormalEvaluator;
