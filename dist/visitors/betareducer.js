"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const application_1 = require("../ast/application");
const lambda_1 = require("../ast/lambda");
const _1 = require(".");
// import Reducer from "./reducer";
const alphaconvertor_1 = require("./alphaconvertor");
const expandor_1 = require("./expandor");
class Reducer extends _1.ASTVisitor {
    constructor(tree) {
        super();
        this.tree = tree;
    }
    static constructFor(tree, nextReduction) {
        if (nextReduction instanceof _1.Reductions.Beta) {
            return new BetaReducer(nextReduction, tree);
        }
        else if (nextReduction instanceof _1.Reductions.Alpha) {
            return new alphaconvertor_1.AlphaConvertor(nextReduction, tree);
        }
        else if (nextReduction instanceof _1.Reductions.Expansion) {
            return new expandor_1.Expandor(nextReduction, tree);
        }
        else {
            // throw new Error('There are no Reduction implementations for type ' + nextReduction)
            // or
            return new Reducer(tree);
        }
    }
    perform() {
        // nothing
    }
}
class BetaReducer extends Reducer {
    constructor({ parent, treeSide, target, argName, value }, tree) {
        super(tree);
        this.substituted = null;
        this.parent = parent;
        this.treeSide = treeSide;
        this.target = target;
        this.argName = argName;
        this.value = value;
        // target.visit(this)
        // if (parent === null) {
        //   this.tree = <AST> this.substituted
        // }
        // else {
        //   parent[<Child> treeSide] = <AST> this.substituted
        //   this.tree = tree
        // }
    }
    onApplication(application) {
        application.left.visit(this);
        const left = this.substituted;
        application.right.visit(this);
        const right = this.substituted;
        this.substituted = new application_1.Application(left, right);
    }
    onLambda(lambda) {
        if (lambda.argument.name() === this.argName) {
            this.substituted = lambda;
        }
        else {
            lambda.body.visit(this);
            const body = this.substituted;
            // TODO: clone or not clone ? i'd say CLONE but consider not clonning
            this.substituted = new lambda_1.Lambda(lambda.argument.clone(), body);
        }
    }
    onChurchNumber(churchNumber) {
        this.substituted = churchNumber;
    }
    onMacro(macro) {
        this.substituted = macro;
    }
    onVariable(variable) {
        if (variable.name() === this.argName) {
            this.substituted = this.value.clone();
        }
        else {
            this.substituted = variable;
        }
    }
    perform() {
        this.target.visit(this);
        if (this.parent === null) {
            this.tree = this.substituted;
        }
        else {
            this.parent[this.treeSide] = this.substituted;
        }
    }
}
exports.BetaReducer = BetaReducer;
