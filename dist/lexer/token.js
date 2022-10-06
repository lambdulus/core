"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = exports.TokenType = void 0;
var TokenType;
(function (TokenType) {
    TokenType["Lambda"] = "lambda";
    TokenType["Dot"] = "dot";
    TokenType["Identifier"] = "identifier";
    TokenType["Number"] = "number";
    TokenType["Operator"] = "operator";
    TokenType["LeftParen"] = "left paren";
    TokenType["RightParen"] = "right paren";
    TokenType["RightBracket"] = "right bracket";
    TokenType["Quote"] = "quote";
})(TokenType = exports.TokenType || (exports.TokenType = {}));
// TODO: discard readonly?
class Token {
    constructor(type, value, position) {
        this.type = type;
        this.value = value;
        this.position = position;
    }
}
exports.Token = Token;
