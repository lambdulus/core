"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const application_1 = require("../parser/ast/application");
const variable_1 = require("../parser/ast/variable");
const lexer_1 = require("../lexer");
class AlphaConvertor {
    constructor({ tree, child, oldName, newName }) {
        // Need to do this Nonsense Dance
        this.converted = null;
        this.tree = tree;
        this.child = child;
        this.oldName = oldName;
        this.newName = newName;
        tree[child].visit(this);
        tree[child] = this.converted; // part of the Nonse Dance
    }
    onApplication(application) {
        application.left.visit(this);
        const left = this.converted;
        application.right.visit(this);
        const right = this.converted;
        this.converted = new application_1.Application(left, right);
    }
    onLambda(lambda) {
        lambda.argument.visit(this);
        const left = this.converted;
        lambda.body.visit(this);
        const right = this.converted;
        lambda.argument = left;
        lambda.body = right;
        this.converted = lambda;
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
