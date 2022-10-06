"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NormalAbstractionEvaluator = void 0;
const visitors_1 = require("../visitors");
const freevarsfinder_1 = require("../visitors/freevarsfinder");
const ast_1 = require("../ast");
const boundingfinder_1 = require("../visitors/boundingfinder");
const reducers_1 = require("../reducers");
const reductions_1 = require("../reductions");
const abstractions_1 = require("../reducers/abstractions");
const parser_1 = require("../parser");
class NormalAbstractionEvaluator extends visitors_1.ASTVisitor {
    constructor(tree) {
        super();
        this.tree = tree;
        this.originalParent = null;
        this.parent = null;
        this.child = null;
        this.originalReduction = new reductions_1.None;
        this.nextReduction = new reductions_1.None;
        this.tree.visit(this);
        try {
            this.reducer = (0, reducers_1.constructFor)(tree, this.nextReduction);
        }
        catch (exception) {
            if (this.nextReduction instanceof reductions_1.Gama) {
                this.nextReduction.parent = this.originalParent;
            }
            this.nextReduction = this.originalReduction;
            this.reducer = (0, reducers_1.constructFor)(tree, this.nextReduction);
        }
    }
    onApplication(application) {
        const parent = this.parent; // backup
        let treeSide = this.child;
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
                    this.nextReduction.redexes.includes(application.left) // TODO: nalevo nebude vzdycky macro // TODO: jakto ze to bude vzdycky makro?
                &&
                    this.nextReduction.args.length < this.nextReduction.abstraction[1] // TODO: udelej z toho vlastni prop nextReduction.arity
            ) {
                // TODO: tohle je spatne - vubec mi nemusi vadit, ze right je APP
                // jsou makra ktera to nezajima [T, F]
                // proto musim zmenit Abstraction a mit tam misto/navic funkce assert
                // jeste list typu argumentu nebo tak neco
                // if (application.right instanceof Application) {
                //   this.nextReduction = new None
                // }
                // TODO: tohle je jenom prozatim - ted je problem aplikaci kdyz je right - tak to rovnou
                // testnu pokud je right applikace - v budoucnu to chci lip - nejak univerzalne bez ifu
                const macroName = this.nextReduction.redexes[0].name();
                const argumentIndex = this.nextReduction.args.length;
                if (application.right instanceof ast_1.Application && !abstractions_1.Abstractions.inAllowedTypesFor(macroName, argumentIndex, ast_1.Application)) {
                    this.nextReduction = new reductions_1.None;
                }
                else {
                    this.nextReduction.args.push(application.right);
                    this.nextReduction.parent = parent;
                    this.nextReduction.treeSide = treeSide;
                    this.nextReduction.redexes.push(application);
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
        this.nextReduction = new reductions_1.None;
        // if (this.parent === null) {
        //   this.nextReduction = new None
        //   return
        // }
        // this.nextReduction = new Expansion(this.parent, this.child, churchNumeral)
    }
    onMacro(macro) {
        if (!(macro.name() in parser_1.builtinMacros)) {
            this.originalReduction = new reductions_1.Expansion(this.parent, this.child, macro);
            this.nextReduction = this.originalReduction;
            this.originalParent = this.parent;
            return;
        }
        // this.originalReduction = new Expansion(this.parent, this.child, macro)
        // TODO: if it is not in builtIn macros - than it is user-defined macro - and I should maybe expand it
        this.originalReduction = new reductions_1.None;
        this.nextReduction = this.originalReduction;
        this.originalParent = this.parent;
        const macroName = macro.name();
        if (abstractions_1.Abstractions.has(macroName)) {
            this.nextReduction = new reductions_1.Gama([macro], [], this.parent, this.child, [macroName, abstractions_1.Abstractions.getArity(macroName)]);
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
