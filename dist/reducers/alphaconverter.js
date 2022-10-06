"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlphaConverter = void 0;
const lexer_1 = require("../lexer");
const ast_1 = require("../ast");
const visitors_1 = require("../visitors");
const usedvarnamesfinder_1 = require("../visitors/usedvarnamesfinder");
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
            const usedVarNamesFinder = new usedvarnamesfinder_1.UsedVarNamesFinder(lambda);
            const usedNames = usedVarNamesFinder.used;
            this.oldName = lambda.argument.name();
            // najit uplne unikatni jmeno uvnitr lambda
            // nejdriv najit vsechna pouzita jmena uvnitr lambda
            // pak vygenerovat nejakou jednoduchou iterativni metodou novej retezec a zkontrolovat na shodu
            this.newName = this.createUniqueName(this.oldName, usedNames);
            // this.newName = `_${this.oldName}` // TODO: create original name
            lambda.argument.visit(this);
            lambda.argument = this.converted;
            lambda.body.visit(this);
            lambda.body = this.converted;
        }
    }
    createUniqueName(original, usedNames) {
        // TODO: this is dirty quick fix/implementation - possibly refactor later
        let suffix = 1;
        let varname = 'a';
        while (suffix <= 9 && usedNames.has(`${original}${suffix}`)) {
            suffix++;
        }
        if (suffix >= 10) {
            while (usedNames.has(varname)) {
                varname = String.fromCharCode(varname.charCodeAt(0) + 1);
            }
            return varname;
        }
        else {
            return `${original}${suffix}`;
        }
    }
}
exports.AlphaConverter = AlphaConverter;
