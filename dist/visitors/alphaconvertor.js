"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const application_1 = require("../parser/ast/application");
const variable_1 = require("../parser/ast/variable");
const lexer_1 = require("../lexer");
class AlphaConvertor {
    constructor({ conversions }) {
        // Need to do this Nonsense Dance
        this.converted = null;
        this.oldName = '';
        this.newName = '';
        this.conversions = conversions;
        for (const { tree, oldName, newName } of this.conversions) {
            this.oldName = oldName;
            this.newName = newName;
            tree.argument.visit(this);
            tree.argument = this.converted;
            tree.body.visit(this);
            tree.body = this.converted;
        }
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
}
exports.AlphaConvertor = AlphaConvertor;
