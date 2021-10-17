"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Abstractions = void 0;
const ast_1 = require("../ast");
const parser_1 = require("../parser");
const lexer_1 = require("../lexer");
const parser_2 = require("../parser/parser");
class Abstractions {
    static has(name) {
        return name in this.knownAbstractions;
    }
    static getArity(name) {
        const [arity] = this.knownAbstractions[name];
        return arity;
    }
    static assert(name, args) {
        const [_, __, assert] = this.knownAbstractions[name];
        return assert(args);
    }
    static evaluate(name, args) {
        const [_, __, ___, evaluation] = this.knownAbstractions[name];
        return evaluation(args);
    }
    static inAllowedTypesFor(name, n, type) {
        const [_, allowedTypesList] = this.knownAbstractions[name];
        const allowedForN = allowedTypesList[n];
        return allowedForN.includes(type);
    }
}
exports.Abstractions = Abstractions;
Abstractions.knownAbstractions = {
    // TODO: consider implementing Y combinator
    'Y': [
        1,
        [[ast_1.Lambda, ast_1.Macro]],
        (args) => {
            const [first] = args;
            return args.length === 1 && (first instanceof ast_1.Lambda || first instanceof ast_1.Macro);
        },
        (args) => {
            const [first] = args;
            let macroTable = {};
            if (first instanceof ast_1.Macro) {
                macroTable = first.macroTable;
            }
            const lambdaValue = `${first.toString()} (Y ${first.toString()})`;
            const parser = new parser_2.Parser((0, lexer_1.tokenize)(lambdaValue, { lambdaLetters: ['\\', 'λ',], singleLetterVars: false, macromap: {} }), macroTable);
            return parser.parse(null);
        }
    ],
    'ZERO': [
        1,
        [[ast_1.ChurchNumeral]],
        (args) => {
            const [first] = args;
            return args.length === 1 && first instanceof ast_1.ChurchNumeral;
        },
        (args) => {
            const [first] = args;
            const value = 0 === Number(first.name());
            const lambdaValue = value ? 'T' : 'F';
            return (0, parser_1.parse)((0, lexer_1.tokenize)(lambdaValue, { lambdaLetters: ['\\', 'λ',], singleLetterVars: false, macromap: {} }), {});
        }
    ],
    'PRED': [
        1,
        [[ast_1.ChurchNumeral]],
        (args) => {
            const [first] = args;
            return args.length === 1 && first instanceof ast_1.ChurchNumeral;
        },
        (args) => {
            const [first] = args;
            const value = Math.max(0, Number(first) - 1);
            const lambdaValue = `${value}`;
            return (0, parser_1.parse)((0, lexer_1.tokenize)(lambdaValue, { lambdaLetters: ['\\', 'λ',], singleLetterVars: false, macromap: {} }), {});
        }
    ],
    'SUC': [
        1,
        [[ast_1.ChurchNumeral]],
        (args) => {
            const [first] = args;
            return args.length === 1 && first instanceof ast_1.ChurchNumeral;
        },
        (args) => {
            const [first] = args;
            const value = Number(first) + 1;
            const lambdaValue = `${value}`;
            return (0, parser_1.parse)((0, lexer_1.tokenize)(lambdaValue, { lambdaLetters: ['\\', 'λ',], singleLetterVars: false, macromap: {} }), {});
        }
    ],
    'AND': [
        2,
        [[ast_1.Macro], [ast_1.Macro]],
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
            return (0, parser_1.parse)((0, lexer_1.tokenize)(lambdaValue, { lambdaLetters: ['\\', 'λ',], singleLetterVars: false, macromap: {} }), {});
        }
    ],
    'OR': [
        2,
        [[ast_1.Macro], [ast_1.Macro]],
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
            return (0, parser_1.parse)((0, lexer_1.tokenize)(lambdaValue, { lambdaLetters: ['\\', 'λ',], singleLetterVars: false, macromap: {} }), {});
        }
    ],
    'NOT': [
        1,
        [[ast_1.Macro]],
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
            return (0, parser_1.parse)((0, lexer_1.tokenize)(lambdaValue, { lambdaLetters: ['\\', 'λ',], singleLetterVars: false, macromap: {} }), {});
        }
    ],
    'T': [
        2,
        [[ast_1.Lambda, ast_1.Application, ast_1.Variable, ast_1.ChurchNumeral, ast_1.Macro], [ast_1.Lambda, ast_1.Application, ast_1.Variable, ast_1.ChurchNumeral, ast_1.Macro]],
        (args) => {
            return args.length === 2;
        },
        (args) => {
            const [first] = args;
            return first;
        }
    ],
    'F': [
        2,
        [[ast_1.Lambda, ast_1.Application, ast_1.Variable, ast_1.ChurchNumeral, ast_1.Macro], [ast_1.Lambda, ast_1.Application, ast_1.Variable, ast_1.ChurchNumeral, ast_1.Macro]],
        (args) => {
            return args.length === 2;
        },
        (args) => {
            const [_, second] = args;
            return second;
        }
    ],
    '+': [
        2,
        [[ast_1.ChurchNumeral], [ast_1.ChurchNumeral]],
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
        [[ast_1.ChurchNumeral], [ast_1.ChurchNumeral]],
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
        [[ast_1.ChurchNumeral], [ast_1.ChurchNumeral]],
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
        [[ast_1.ChurchNumeral], [ast_1.ChurchNumeral]],
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
        [[ast_1.ChurchNumeral], [ast_1.ChurchNumeral]],
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
        [[ast_1.ChurchNumeral], [ast_1.ChurchNumeral]],
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
        [[ast_1.ChurchNumeral], [ast_1.ChurchNumeral]],
        (args) => {
            const [first, second] = args;
            return args.length === 2 && first instanceof ast_1.ChurchNumeral && second instanceof ast_1.ChurchNumeral;
        }, (args) => {
            const [first, second] = args;
            const value = Number(first.name()) === Number(second.name());
            const lambdaValue = value ? 'T' : 'F';
            return (0, parser_1.parse)((0, lexer_1.tokenize)(lambdaValue, { lambdaLetters: ['\\', 'λ',], singleLetterVars: false, macromap: {} }), {});
        }
    ],
    '>': [
        2,
        [[ast_1.ChurchNumeral], [ast_1.ChurchNumeral]],
        (args) => {
            const [first, second] = args;
            return args.length === 2 && first instanceof ast_1.ChurchNumeral && second instanceof ast_1.ChurchNumeral;
        }, (args) => {
            const [first, second] = args;
            const value = Number(first.name()) > Number(second.name());
            const lambdaValue = value ? 'T' : 'F';
            return (0, parser_1.parse)((0, lexer_1.tokenize)(lambdaValue, { lambdaLetters: ['\\', 'λ',], singleLetterVars: false, macromap: {} }), {});
        }
    ],
    '<': [
        2,
        [[ast_1.ChurchNumeral], [ast_1.ChurchNumeral]],
        (args) => {
            const [first, second] = args;
            return args.length === 2 && first instanceof ast_1.ChurchNumeral && second instanceof ast_1.ChurchNumeral;
        }, (args) => {
            const [first, second] = args;
            const value = Number(first.name()) < Number(second.name());
            const lambdaValue = value ? 'T' : 'F';
            return (0, parser_1.parse)((0, lexer_1.tokenize)(lambdaValue, { lambdaLetters: ['\\', 'λ',], singleLetterVars: false, macromap: {} }), {});
        }
    ],
    '>=': [
        2,
        [[ast_1.ChurchNumeral], [ast_1.ChurchNumeral]],
        (args) => {
            const [first, second] = args;
            return args.length === 2 && first instanceof ast_1.ChurchNumeral && second instanceof ast_1.ChurchNumeral;
        }, (args) => {
            const [first, second] = args;
            const value = Number(first.name()) >= Number(second.name());
            const lambdaValue = value ? 'T' : 'F';
            return (0, parser_1.parse)((0, lexer_1.tokenize)(lambdaValue, { lambdaLetters: ['\\', 'λ',], singleLetterVars: false, macromap: {} }), {});
        }
    ],
    '<=': [
        2,
        [[ast_1.ChurchNumeral], [ast_1.ChurchNumeral]],
        (args) => {
            const [first, second] = args;
            return args.length === 2 && first instanceof ast_1.ChurchNumeral && second instanceof ast_1.ChurchNumeral;
        }, (args) => {
            const [first, second] = args;
            const value = Number(first.name()) <= Number(second.name());
            const lambdaValue = value ? 'T' : 'F';
            return (0, parser_1.parse)((0, lexer_1.tokenize)(lambdaValue, { lambdaLetters: ['\\', 'λ',], singleLetterVars: false, macromap: {} }), {});
        }
    ],
};
