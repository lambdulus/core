"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lexer_1 = require("../lexer");
const application_1 = require("../ast/application");
const variable_1 = require("../ast/variable");
const _1 = require(".");
// import Reducer from "./reducer";
const betareducer_1 = require("./betareducer");
const expandor_1 = require("./expandor");
class Reducer extends _1.ASTVisitor {
    constructor(tree) {
        super();
        this.tree = tree;
    }
    static constructFor(tree, nextReduction) {
        if (nextReduction instanceof _1.Reductions.Beta) {
            return new betareducer_1.BetaReducer(nextReduction, tree);
        }
        else if (nextReduction instanceof _1.Reductions.Alpha) {
            return new AlphaConvertor(nextReduction, tree);
        }
        else if (nextReduction instanceof _1.Reductions.Expansion) {
            return new expandor_1.Expandor(nextReduction, tree);
        }
        else {
            // throw new Error('There are no Reduction implementations for type' + nextReduction.toString())
            // or
            return new Reducer(tree);
        }
    }
    perform() {
        // nothing
    }
}
class AlphaConvertor extends Reducer {
    constructor({ conversions }, tree) {
        super(tree);
        // Need to do this Nonsense Dance
        this.converted = null;
        this.oldName = '';
        this.newName = '';
        this.conversions = conversions;
    }
    onApplication(application) {
        application.left.visit(this);
        const left = this.converted;
        application.right.visit(this);
        const right = this.converted;
        this.converted = new application_1.Application(left, right);
    }
    onLambda(lambda) {
        if (lambda.argument.name() !== this.oldName) {
            lambda.body.visit(this);
            const right = this.converted;
            lambda.body = right;
            this.converted = lambda;
        }
        else {
            this.converted = lambda;
        }
    }
    onChurchNumber(churchNumber) {
        this.converted = churchNumber;
    }
    onMacro(macro) {
        this.converted = macro;
    }
    onVariable(variable) {
        if (variable.name() === this.oldName) {
            const token = new lexer_1.Token(variable.token.type, this.newName, variable.token.position);
            this.converted = new variable_1.Variable(token);
        }
        else {
            this.converted = variable;
        }
    }
    perform() {
        for (const lambda of this.conversions) {
            this.oldName = lambda.argument.name();
            this.newName = `_${this.oldName}`; // TODO: create original name
            lambda.argument.visit(this);
            lambda.argument = this.converted;
            lambda.body.visit(this);
            lambda.body = this.converted;
        }
    }
}
exports.AlphaConvertor = AlphaConvertor;
