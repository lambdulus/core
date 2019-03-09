"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const variable_1 = require("../parser/ast/variable");
const lambda_1 = require("../parser/ast/lambda");
const freevarsfinder_1 = require("./freevarsfinder");
const varbindfinder_1 = require("./varbindfinder");
class NormalEvaluator {
    constructor(tree) {
        this.tree = tree;
        this.parent = null;
        this.child = null;
        this.nextReduction = new _1.NextNone;
        this.tree.visit(this);
    }
    onApplication(application) {
        if (application.left instanceof variable_1.Variable) {
            this.parent = application;
            this.child = _1.Child.Right;
            application.right.visit(this);
        }
        else if (application.left instanceof lambda_1.Lambda) {
            const freeVarsFinder = new freevarsfinder_1.FreeVarsFinder(application.right);
            const freeVars = freeVarsFinder.freeVars;
            //TODO: IMPORTANT - this is exactly right idea, there is really sense in renaming all of free at once
            const alphas = [];
            for (const varName of freeVars) {
                const binder = new varbindfinder_1.VarBindFinder(application.left, varName);
                const lambda = binder.lambda;
                if (lambda && application.left.argument.name() !== varName) {
                    // TODO: find truly original non conflicting new name probably using number postfixes
                    alphas.push({ tree: lambda, oldName: varName, newName: `_${varName}` });
                }
            }
            if (alphas.length) {
                this.nextReduction = new _1.NextAlpha(alphas);
            }
            else {
                this.nextReduction = new _1.NextBeta(this.parent, this.child, application.left.body, application.left.argument.name(), application.right);
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
        this.nextReduction = new _1.NextExpansion(this.parent, this.child, churchNumber);
    }
    onMacro(macro) {
        this.nextReduction = new _1.NextExpansion(this.parent, this.child, macro);
    }
    onVariable(variable) {
        this.nextReduction = new _1.NextNone;
    }
}
exports.NormalEvaluator = NormalEvaluator;
