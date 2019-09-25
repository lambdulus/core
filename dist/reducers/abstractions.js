"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ast_1 = require("../ast");
const parser_1 = require("../parser");
const lexer_1 = require("../lexer");
class Abstractions {
    static has(name) {
        return name in this.knownAbstractions;
    }
    static getArity(name) {
        const [arity] = this.knownAbstractions[name];
        return arity;
    }
    static assert(name, args) {
        const [_, assert] = this.knownAbstractions[name];
        return assert(args);
    }
    static evaluate(name, args) {
        const [_, __, evaluation] = this.knownAbstractions[name];
        return evaluation(args);
    }
}
exports.Abstractions = Abstractions;
Abstractions.knownAbstractions = {
    'ZERO': [
        1,
        (args) => {
            const [first] = args;
            return args.length === 1 && first instanceof ast_1.ChurchNumeral;
        },
        (args) => {
            const [first] = args;
            const value = 0 === Number(first.name());
            const lambdaValue = value ? 'T' : 'F';
            return parser_1.parse(lexer_1.tokenize(lambdaValue, { lambdaLetters: ['\\'], singleLetterVars: false }), {});
        }
    ],
    // 'PRED' : [ 1, () => true, () => {} ],
    // 'SUC' : [ 1, () => true, () => {} ],
    // 'AND' : [ 2, () => true, () => {} ],
    // 'OR' : [ 2, () => true, () => {} ],
    // 'NOT' : [ 1, () => true, () => {} ],
    '+': [
        2,
        (args) => {
            const [first, second] = args;
            return args.length === 2 && first instanceof ast_1.ChurchNumeral && second instanceof ast_1.ChurchNumeral;
        },
        (args) => {
            const [first, second] = args;
            const value = Number(first.name()) + Number(second.name());
            const dummyToken = new lexer_1.Token(lexer_1.TokenType.Number, `${value}`, lexer_1.BLANK_POSITION);
            return new ast_1.ChurchNumeral(dummyToken);
        }
    ],
    '-': [
        2,
        (args) => {
            const [first, second] = args;
            return args.length === 2 && first instanceof ast_1.ChurchNumeral && second instanceof ast_1.ChurchNumeral;
        },
        (args) => {
            const [first, second] = args;
            const value = Number(first.name()) - Number(second.name());
            const dummyToken = new lexer_1.Token(lexer_1.TokenType.Number, `${value}`, lexer_1.BLANK_POSITION);
            return new ast_1.ChurchNumeral(dummyToken);
        }
    ],
    '*': [
        2,
        (args) => {
            const [first, second] = args;
            return args.length === 2 && first instanceof ast_1.ChurchNumeral && second instanceof ast_1.ChurchNumeral;
        },
        (args) => {
            const [first, second] = args;
            const value = Number(first.name()) * Number(second.name());
            const dummyToken = new lexer_1.Token(lexer_1.TokenType.Number, `${value}`, lexer_1.BLANK_POSITION);
            return new ast_1.ChurchNumeral(dummyToken);
        }
    ],
    '/': [
        2,
        (args) => {
            const [first, second] = args;
            return args.length === 2 && first instanceof ast_1.ChurchNumeral && second instanceof ast_1.ChurchNumeral;
        },
        (args) => {
            const [first, second] = args;
            const value = Number(first.name()) / Number(second.name());
            const dummyToken = new lexer_1.Token(lexer_1.TokenType.Number, `${value}`, lexer_1.BLANK_POSITION);
            return new ast_1.ChurchNumeral(dummyToken);
        }
    ],
    '^': [
        2,
        (args) => {
            const [first, second] = args;
            return args.length === 2 && first instanceof ast_1.ChurchNumeral && second instanceof ast_1.ChurchNumeral;
        },
        (args) => {
            const [first, second] = args;
            const value = Number(first.name()) ^ Number(second.name());
            const dummyToken = new lexer_1.Token(lexer_1.TokenType.Number, `${value}`, lexer_1.BLANK_POSITION);
            return new ast_1.ChurchNumeral(dummyToken);
        }
    ],
    'DELTA': [
        2,
        (args) => {
            const [first, second] = args;
            return args.length === 2 && first instanceof ast_1.ChurchNumeral && second instanceof ast_1.ChurchNumeral;
        }, (args) => {
            const [first, second] = args;
            const value = Math.abs(Number(first.name()) - Number(second.name()));
            const dummyToken = new lexer_1.Token(lexer_1.TokenType.Number, `${value}`, lexer_1.BLANK_POSITION);
            return new ast_1.ChurchNumeral(dummyToken);
        }
    ],
    '=': [
        2,
        (args) => {
            const [first, second] = args;
            return args.length === 2 && first instanceof ast_1.ChurchNumeral && second instanceof ast_1.ChurchNumeral;
        }, (args) => {
            const [first, second] = args;
            const value = Number(first.name()) === Number(second.name());
            const lambdaValue = value ? 'T' : 'F';
            return parser_1.parse(lexer_1.tokenize(lambdaValue, { lambdaLetters: ['\\'], singleLetterVars: false }), {});
        }
    ],
    '>': [
        2,
        (args) => {
            const [first, second] = args;
            return args.length === 2 && first instanceof ast_1.ChurchNumeral && second instanceof ast_1.ChurchNumeral;
        }, (args) => {
            const [first, second] = args;
            const value = Number(first.name()) > Number(second.name());
            const lambdaValue = value ? 'T' : 'F';
            return parser_1.parse(lexer_1.tokenize(lambdaValue, { lambdaLetters: ['\\'], singleLetterVars: false }), {});
        }
    ],
    '<': [
        2,
        (args) => {
            const [first, second] = args;
            return args.length === 2 && first instanceof ast_1.ChurchNumeral && second instanceof ast_1.ChurchNumeral;
        }, (args) => {
            const [first, second] = args;
            const value = Number(first.name()) < Number(second.name());
            const lambdaValue = value ? 'T' : 'F';
            return parser_1.parse(lexer_1.tokenize(lambdaValue, { lambdaLetters: ['\\'], singleLetterVars: false }), {});
        }
    ],
    '>=': [
        2,
        (args) => {
            const [first, second] = args;
            return args.length === 2 && first instanceof ast_1.ChurchNumeral && second instanceof ast_1.ChurchNumeral;
        }, (args) => {
            const [first, second] = args;
            const value = Number(first.name()) >= Number(second.name());
            const lambdaValue = value ? 'T' : 'F';
            return parser_1.parse(lexer_1.tokenize(lambdaValue, { lambdaLetters: ['\\'], singleLetterVars: false }), {});
        }
    ],
    '<=': [
        2,
        (args) => {
            const [first, second] = args;
            return args.length === 2 && first instanceof ast_1.ChurchNumeral && second instanceof ast_1.ChurchNumeral;
        }, (args) => {
            const [first, second] = args;
            const value = Number(first.name()) <= Number(second.name());
            const lambdaValue = value ? 'T' : 'F';
            return parser_1.parse(lexer_1.tokenize(lambdaValue, { lambdaLetters: ['\\'], singleLetterVars: false }), {});
        }
    ],
};
