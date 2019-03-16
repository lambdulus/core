"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const counter_1 = require("./counter");
const _1 = require("./");
class Lexer {
    constructor(source, config) {
        this.source = source;
        this.config = config;
        this.position = new counter_1.Counter;
        this.tokens = [];
    }
    top() {
        return this.source[this.position.position];
    }
    pop() {
        const current = this.top();
        if (current === '\n') {
            this.position.newLine();
        }
        else {
            this.position.nextChar();
        }
        return current;
    }
    isWhiteSpace(char) {
        return char.trim() !== char;
    }
    isLeftParen(char) {
        return char === '(';
    }
    isRightParen(char) {
        return char === ')';
    }
    isDot(char) {
        return char === '.';
    }
    isNumeric(char) {
        return char >= '0' && char <= '9';
    }
    isAlphabetic(char) {
        return (char >= 'a' && char <= 'z'
            ||
                char >= 'A' && char <= 'Z');
    }
    getCharToken(kind) {
        const position = this.position.toRecord();
        const char = this.pop();
        return new _1.Token(kind, char, position);
    }
    readLeftParen() {
        const paren = this.getCharToken(_1.TokenType.LeftParen);
        this.tokens.push(paren);
    }
    readRightParen() {
        const paren = this.getCharToken(_1.TokenType.RightParen);
        this.tokens.push(paren);
    }
    readDot() {
        const dot = this.getCharToken(_1.TokenType.Dot);
        this.tokens.push(dot);
    }
    readLambda() {
        const lambda = this.getCharToken(_1.TokenType.Lambda);
        this.tokens.push(lambda);
    }
    readIdentifier() {
        let id = '';
        let topPosition = this.position.toRecord();
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
            throw new _1.InvalidIdentifier(`${id}${top}`, topPosition);
        }
        const identifier = new _1.Token(_1.TokenType.Identifier, id, topPosition);
        this.tokens.push(identifier);
    }
    readNumber() {
        let n = 0;
        let topPosition = this.position.toRecord();
        while (this.isNumeric(this.top())) {
            n = n * 10 + Number(this.pop());
        }
        if (this.isAlphabetic(this.top())) {
            throw new _1.InvalidNumber(`${n}${top}`, topPosition);
        }
        const number = new _1.Token(_1.TokenType.Number, n, topPosition);
        this.tokens.push(number);
    }
    mayBeLambda(char) {
        return this.config.lambdaLetters.indexOf(char) !== -1;
    }
    mayBeIdentifier(char) {
        return this.isAlphabetic(this.top());
    }
    mayBeNumber(char) {
        return this.isNumeric(char);
    }
    tokenize() {
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
                    const operator = this.pop();
                    let topPosition = this.position.toRecord();
                    this.tokens.push(new _1.Token(_1.TokenType.Operator, operator, topPosition));
                    break;
                }
                case '<':
                case '>': {
                    let operator = this.pop();
                    let topPosition = this.position.toRecord();
                    if (this.top() === '=') {
                        operator += this.pop();
                    }
                    this.tokens.push(new _1.Token(_1.TokenType.Operator, operator, topPosition));
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
                        // console.error(`Invalid character ${ this.position.toRecord() } \
                        // at row ${ this.position.row } column ${ this.position.column }.`)
                        // TODO: refactor
                        // I need to send custom Error class containing all information in structured way not string
                        throw (new Error(`Invalid character ${this.position.toRecord()} \
          at row ${this.position.row} column ${this.position.column}.`));
                    }
            }
            // TODO: implement error handling already
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
    }
}
function hintOperator(error, operators) {
    const { value: invalid } = error;
    const relevant = operators.filter((operator) => operator.indexOf(invalid) !== -1
        ||
            invalid.indexOf(operator) !== -1);
    if (!relevant.length) {
        return '';
    }
    return (`Hint: Did you mean to write one of these?
    ${relevant.map((operator) => `${operator}\n`)}`);
}
function tokenize(input, config) {
    const lexer = new Lexer(input + ' ', config);
    return lexer.tokenize();
}
exports.tokenize = tokenize;
