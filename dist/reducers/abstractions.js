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
    // TODO: consider implementing Y combinator
    // 'Y' : [
    //   1,
    //   (args : Array<AST>) => {
    //     const [ first ] = args
    //     return args.length === 1 && first instanceof Lambda
    //   },
    //   (args : Array<AST>) => {
    //     const [ first ] = args
    //     const lambdaValue : string = `Y (Y ${first.toString()})`
    //     return parse(tokenize(lambdaValue, { lambdaLetters : [ '\\' ], singleLetterVars : false }), {})
    //   }
    // ],
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
    'PRED': [
        1,
        (args) => {
            const [first] = args;
            return args.length === 1 && first instanceof ast_1.ChurchNumeral;
        },
        (args) => {
            const [first] = args;
            const value = Math.max(0, Number(first) - 1);
            const lambdaValue = `${value}`;
            return parser_1.parse(lexer_1.tokenize(lambdaValue, { lambdaLetters: ['\\'], singleLetterVars: false }), {});
        }
    ],
    'SUC': [
        1,
        (args) => {
            const [first] = args;
            return args.length === 1 && first instanceof ast_1.ChurchNumeral;
        },
        (args) => {
            const [first] = args;
            const value = Number(first) + 1;
            const lambdaValue = `${value}`;
            return parser_1.parse(lexer_1.tokenize(lambdaValue, { lambdaLetters: ['\\'], singleLetterVars: false }), {});
        }
    ],
    'AND': [
        2,
        (args) => {
            const [first, second] = args;
            return args.length === 2 && first instanceof ast_1.Macro && second instanceof ast_1.Macro && (first.name() === 'T' || first.name() === 'F') && (second.name() === 'T' || second.name() === 'F');
        },
        (args) => {
            const [first, second] = args;
            const firstBoolean = first.name() === 'T' ? true : false;
            const secondBoolean = second.name() === 'T' ? true : false;
            const value = firstBoolean && secondBoolean;
            const lambdaValue = value ? 'T' : 'F';
            return parser_1.parse(lexer_1.tokenize(lambdaValue, { lambdaLetters: ['\\'], singleLetterVars: false }), {});
        }
    ],
    'OR': [
        2,
        (args) => {
            const [first, second] = args;
            return args.length === 2 && first instanceof ast_1.Macro && second instanceof ast_1.Macro && (first.name() === 'T' || first.name() === 'F') && (second.name() === 'T' || second.name() === 'F');
        },
        (args) => {
            const [first, second] = args;
            const firstBoolean = first.name() === 'T' ? true : false;
            const secondBoolean = second.name() === 'T' ? true : false;
            const value = firstBoolean || secondBoolean;
            const lambdaValue = value ? 'T' : 'F';
            return parser_1.parse(lexer_1.tokenize(lambdaValue, { lambdaLetters: ['\\'], singleLetterVars: false }), {});
        }
    ],
    'NOT': [
        1,
        (args) => {
            const [first] = args;
            return args.length === 1 && first instanceof ast_1.Macro && (first.name() === 'F' || first.name() === 'T');
        },
        (args) => {
            const [first] = args;
            const name = first.name();
            const value = name === 'T' ? true : false;
            const negative = !value;
            const lambdaValue = negative ? 'T' : 'F';
            // TODO: if I create Boolean offspring of Macro - this place is to get more simple
            return parser_1.parse(lexer_1.tokenize(lambdaValue, { lambdaLetters: ['\\'], singleLetterVars: false }), {});
        }
    ],
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
