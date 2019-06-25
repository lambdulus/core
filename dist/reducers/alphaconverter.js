"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lexer_1 = require("../lexer");
const ast_1 = require("../ast");
const visitors_1 = require("../visitors");
class AlphaConverter extends visitors_1.ASTVisitor {
    constructor({ conversions }, tree) {
        super();
        this.tree = tree;
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
        this.converted = new ast_1.Application(left, right, application.identifier);
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
    onChurchNumeral(churchNumeral) {
        this.converted = churchNumeral;
    }
    onMacro(macro) {
        this.converted = macro;
    }
    onVariable(variable) {
        if (variable.name() === this.oldName) {
            const token = new lexer_1.Token(variable.token.type, this.newName, variable.token.position);
            this.converted = new ast_1.Variable(token, variable.identifier);
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
exports.AlphaConverter = AlphaConverter;
