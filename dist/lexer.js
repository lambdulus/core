"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var counter_1 = __importDefault(require("./counter"));
var TokenType;
(function (TokenType) {
    TokenType[TokenType["Lambda"] = 0] = "Lambda";
    TokenType[TokenType["Dot"] = 1] = "Dot";
    TokenType[TokenType["Identifier"] = 2] = "Identifier";
    TokenType[TokenType["Number"] = 3] = "Number";
    TokenType[TokenType["Operator"] = 4] = "Operator";
    TokenType[TokenType["LeftParen"] = 5] = "LeftParen";
    TokenType[TokenType["RightParen"] = 6] = "RightParen";
})(TokenType = exports.TokenType || (exports.TokenType = {}));
var Token = /** @class */ (function () {
    function Token(type, value, position) {
        this.type = type;
        this.value = value;
        this.position = position;
    }
    return Token;
}());
exports.Token = Token;
// ---------------------------------------------------
var InvalidIdentifier = /** @class */ (function (_super) {
    __extends(InvalidIdentifier, _super);
    function InvalidIdentifier(value, position) {
        var _this = _super.call(this) || this;
        _this.value = value;
        _this.position = position;
        return _this;
    }
    return InvalidIdentifier;
}(Error));
var InvalidNumber = /** @class */ (function (_super) {
    __extends(InvalidNumber, _super);
    function InvalidNumber(value, position) {
        var _this = _super.call(this) || this;
        _this.value = value;
        _this.position = position;
        return _this;
    }
    return InvalidNumber;
}(Error));
var InvalidOperator = /** @class */ (function (_super) {
    __extends(InvalidOperator, _super);
    function InvalidOperator(value, position) {
        var _this = _super.call(this) || this;
        _this.value = value;
        _this.position = position;
        return _this;
    }
    return InvalidOperator;
}(Error));
// ---------------------------------------------------
var Lexer = /** @class */ (function () {
    function Lexer(source, config) {
        this.source = source;
        this.config = config;
        this.position = new counter_1.default; // todo: replace with simple object or na, IDK
        this.tokens = [];
    }
    Lexer.prototype.top = function () {
        return this.source[this.position.position];
    };
    Lexer.prototype.pop = function () {
        var current = this.top();
        if (current === '\n') {
            this.position.newLine();
        }
        else {
            this.position.nextChar();
        }
        return current;
    };
    Lexer.prototype.isWhiteSpace = function (char) {
        return char.trim() !== char;
    };
    Lexer.prototype.isLeftParen = function (char) {
        return char === '(';
    };
    Lexer.prototype.isRightParen = function (char) {
        return char === ')';
    };
    Lexer.prototype.isDot = function (char) {
        return char === '.';
    };
    Lexer.prototype.isNumeric = function (char) {
        return char >= '0' && char <= '9';
    };
    Lexer.prototype.isAlphabetic = function (char) {
        return (char >= 'a' && char <= 'z'
            ||
                char >= 'A' && char <= 'Z');
    };
    Lexer.prototype.getCharToken = function (kind) {
        var position = this.position.toRecord();
        var char = this.pop();
        return new Token(kind, char, position);
    };
    Lexer.prototype.readLeftParen = function () {
        var paren = this.getCharToken(TokenType.LeftParen);
        this.tokens.push(paren);
    };
    Lexer.prototype.readRightParen = function () {
        var paren = this.getCharToken(TokenType.RightParen);
        this.tokens.push(paren);
    };
    Lexer.prototype.readDot = function () {
        var dot = this.getCharToken(TokenType.Dot);
        this.tokens.push(dot);
    };
    Lexer.prototype.readLambda = function () {
        var lambda = this.getCharToken(TokenType.Lambda);
        this.tokens.push(lambda);
    };
    Lexer.prototype.readIdentifier = function () {
        var id = '';
        var topPosition = this.position.toRecord();
        // alphabetic part
        while (this.isAlphabetic(this.top())) {
            id += this.pop();
            // todo: implement this
            // v pripade single letter id - single alpha + any number of digit
            // if (this.config.singleLetterVars) {
            //   new Token(TokenType.Identifier, this.pop(), topPosition)
            // }
        }
        // optional numeric part
        while (this.isNumeric(this.top())) {
            id += this.pop();
        }
        // whitespace neni nutny
        // kontrolovat to co vadi [ alphabetic ]
        if (this.isAlphabetic(this.top())) {
            throw new InvalidIdentifier("" + id + top, topPosition);
        }
        var identifier = new Token(TokenType.Identifier, id, topPosition);
        this.tokens.push(identifier);
    };
    Lexer.prototype.readNumber = function () {
        var n = 0;
        var topPosition = this.position.toRecord();
        while (this.isNumeric(this.top())) {
            n = n * 10 + Number(this.pop());
        }
        if (this.isAlphabetic(this.top())) {
            throw new InvalidNumber("" + n + top, topPosition);
        }
        var number = new Token(TokenType.Number, n, topPosition);
        this.tokens.push(number);
    };
    Lexer.prototype.mayBeLambda = function (char) {
        return this.config.lambdaLetters.indexOf(char) !== -1;
    };
    Lexer.prototype.mayBeIdentifier = function (char) {
        return this.isAlphabetic(this.top());
    };
    Lexer.prototype.mayBeNumber = function (char) {
        return this.isNumeric(char);
    };
    Lexer.prototype.tokenize = function () {
        while (this.position.position < this.source.length) {
            switch (this.top()) {
                case '(':
                    this.readLeftParen();
                    break;
                case ')':
                    this.readRightParen();
                    break;
                case '.':
                    this.readDot();
                    break;
                case '+':
                case '-':
                case '*':
                case '/':
                case '=':
                case '^': {
                    var operator = this.pop();
                    var topPosition = this.position.toRecord();
                    this.tokens.push(new Token(TokenType.Operator, operator, topPosition));
                    break;
                }
                case '<':
                case '>': {
                    // TODO: implement <= >=
                    var operator = this.pop();
                    var topPosition = this.position.toRecord();
                    if (this.top() === '=') {
                        operator += this.pop();
                    }
                    this.tokens.push(new Token(TokenType.Operator, operator, topPosition));
                    break;
                }
                default:
                    if (this.mayBeNumber(this.top()))
                        this.readNumber();
                    else if (this.mayBeIdentifier(this.top()))
                        this.readIdentifier();
                    else if (this.mayBeLambda(this.top()))
                        this.readLambda();
                    else if (this.isWhiteSpace(this.top()))
                        this.pop();
                    else {
                        console.error("Invalid character " + this.position.toRecord() + "           at row " + this.position.row + " column " + this.position.column + ".");
                    }
            }
            // nechytat chybu tady
            // nechat ji probublat ven z tohohle modulu
            // odchyti si ji super modul kerej tohle pouziva
            // hint nech v erroru a super modul uz jenom vypise chybu a hint a zaformatuje
            // catch (error) {
            //   if (error instanceof InvalidNumber) {
            //     const { value } = error
            //     const { row, column } = this.position.toRecord()
            //     console.error(`Invalid character when expecting valid Number \
            //     at row ${ row } column ${ column }
            //     you probably misstyped ${ value }`)
            //   }
            //   if (error instanceof InvalidOperator) {
            //     const { value } = error
            //     const { row, column } = this.position.toRecord()
            //     console.error(`Invalid character when expecting valid Operator \
            //     at row ${ row } column ${ column }
            //     you probably misstyped ${ value }
            //     ${ hintOperator(error, this.operators) }`)
            //   }
            //   if (error instanceof InvalidIdentifier) {
            //     // TODO: implement
            //   }
            //   throw error      
            // }
        }
        return this.tokens;
    };
    return Lexer;
}());
function hintOperator(error, operators) {
    var invalid = error.value;
    var relevant = operators.filter(function (operator) {
        return operator.indexOf(invalid) !== -1
            ||
                invalid.indexOf(operator) !== -1;
    });
    if (!relevant.length) {
        return '';
    }
    return ("Hint: Did you mean to write one of these?\n    " + relevant.map(function (operator) { return operator + "\n"; }));
}
function tokenize(input, config) {
    var lexer = new Lexer(input + ' ', config);
    return lexer.tokenize();
}
exports.tokenize = tokenize;
exports.default = {
    // Token,
    // TokenType,
    tokenize: tokenize,
};
