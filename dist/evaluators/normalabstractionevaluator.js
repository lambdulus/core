"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const visitors_1 = require("../visitors");
const freevarsfinder_1 = require("../visitors/freevarsfinder");
const ast_1 = require("../ast");
const boundingfinder_1 = require("../visitors/boundingfinder");
const reducers_1 = require("../reducers");
const reductions_1 = require("../reductions");
////////////////////////////////////////////////////////////
class NormalAbstractionEvaluator extends visitors_1.ASTVisitor {
    constructor(tree) {
        super();
        this.tree = tree;
        this.originalParent = null;
        this.parent = null;
        this.child = null;
        this.originalReduction = new reductions_1.None;
        this.nextReduction = new reductions_1.None;
        // TODO: refactor this out - to reducer file
        // make it { [ name : string ] : pair<arity, function> }
        // then create helper functions for getting parts of it -> for Gama constructor and so on
        // this will solve the redundancy of identifiers
        // NOPE
        // udelam z toho normalne class
        // bude mit normalne metodu knows() / has()
        // bude mit neco getArity(name : string) : number
        // bude mit neco jako getAssertion(name : string, arguments : Array<GamaArg>) : boolean
        // getEvaluation(name : string) : Function
        this.knownAbstraction = {
            'ZERO': 1,
            'PRED': 1,
            'SUC': 1,
            'AND': 2,
            'OR': 2,
            'NOT': 1,
            '+': 2,
            '-': 2,
            '*': 2,
            '/': 2,
            '^': 2,
            'DELTA': 2,
            '=': 2,
            '>': 2,
            '<': 2,
            '>=': 2,
            '<=': 2,
        };
        this.tree.visit(this);
        try {
            this.reducer = reducers_1.constructFor(tree, this.nextReduction);
        }
        catch (exception) {
            if (this.nextReduction instanceof reductions_1.Gama) {
                this.nextReduction.parent = this.originalParent;
            }
            this.nextReduction = this.originalReduction;
            this.reducer = reducers_1.constructFor(tree, this.nextReduction);
        }
    }
    onApplication(application) {
        const parent = this.parent; // backup
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
                this.nextReduction = new reductions_1.Beta(application, this.parent, this.child, application.left.body, application.left.argument.name(), application.right);
            }
        }
        // (this.left instanceof Macro || this.left instanceof ChurchNumeral || this.left instanceof Application)
        else {
            this.parent = application;
            this.child = ast_1.Child.Left;
            application.left.visit(this);
            if (this.nextReduction instanceof reductions_1.Gama
                &&
                    this.nextReduction.redexes.includes(application.left)
                &&
                    this.nextReduction.args.length < this.nextReduction.abstraction[1]) {
                this.nextReduction.redexes.push(application);
                // TODO: refactor this please
                if (application.right instanceof ast_1.Variable
                    ||
                        application.right instanceof ast_1.Macro
                    ||
                        application.right instanceof ast_1.ChurchNumeral
                    ||
                        application.right instanceof ast_1.Lambda) {
                    this.nextReduction.args.push(application.right);
                    this.nextReduction.parent = parent;
                }
            }
            if (this.nextReduction instanceof reductions_1.None) {
                this.parent = application;
                this.child = ast_1.Child.Right;
                application.right.visit(this);
            }
        }
    }
    // na lambde bych se zastavil - to se stane samo - tim, ze se lambda neulozi do sequence redexu
    onLambda(lambda) {
        this.parent = lambda;
        this.child = ast_1.Child.Right;
        lambda.body.visit(this);
    }
    onChurchNumeral(churchNumeral) {
        this.nextReduction = new reductions_1.Expansion(this.parent, this.child, churchNumeral);
    }
    onMacro(macro) {
        this.originalReduction = new reductions_1.Expansion(this.parent, this.child, macro);
        this.nextReduction = this.originalReduction;
        this.originalParent = this.parent;
        const macroName = macro.name();
        if (macroName in this.knownAbstraction) {
            this.nextReduction = new reductions_1.Gama([macro], [], this.parent, this.child, [macroName, this.knownAbstraction[macroName]] // TODO: refactor with some helper function
            );
        }
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
