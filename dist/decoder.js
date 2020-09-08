"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeSafe = exports.decodeFast = void 0;
const ast_1 = require("./ast");
const lexer_1 = require("./lexer");
function decodeFast(tree) {
    switch (tree.type) {
        case 'application': {
            const left = tree.left;
            const right = tree.right;
            const leftNode = decodeFast(left);
            const rightNode = decodeFast(right);
            if (leftNode !== null && rightNode !== null) {
                return new ast_1.Application(leftNode, rightNode);
            }
            return null;
        }
        case 'lambda': {
            const argument = tree.argument;
            const body = tree.body;
            const leftNode = decodeFast(argument);
            const rightNode = decodeFast(body);
            if (argument.type === 'variable' && leftNode !== null && rightNode !== null) {
                return new ast_1.Lambda(leftNode, rightNode);
            }
            return null;
        }
        case 'churchnumeral': {
            if ('token' in tree) {
                return new ast_1.ChurchNumeral(tree.token);
            }
            return null;
        }
        case 'macro': {
            if ('token' in tree && 'macroTable' in tree) {
                return new ast_1.Macro(tree.token, tree.macroTable);
            }
            return null;
        }
        case 'variable': {
            if ('token' in tree) {
                return new ast_1.Variable(tree.token);
            }
            return null;
        }
        default:
            return null;
    }
}
exports.decodeFast = decodeFast;
function decodeSafe(tree) {
    if (!(typeof tree === 'object'
        &&
            'type' in tree
        &&
            typeof tree.type === 'string')) {
        return null;
    }
    switch (tree.type) {
        case 'application': {
            if (!('left' in tree && 'right' in tree)) {
                return null;
            }
            const left = tree.left;
            const right = tree.right;
            const leftNode = decodeSafe(left);
            const rightNode = decodeSafe(right);
            if (leftNode !== null && rightNode !== null) {
                return new ast_1.Application(leftNode, rightNode);
            }
            return null;
        }
        case 'lambda': {
            if (!('argument' in tree && 'body' in tree)) {
                return null;
            }
            const argument = tree.argument;
            const body = tree.body;
            const leftNode = decodeSafe(argument);
            const rightNode = decodeSafe(body);
            if (leftNode !== null && rightNode !== null && leftNode instanceof ast_1.Variable) {
                return new ast_1.Lambda(leftNode, rightNode);
            }
            return null;
        }
        case 'churchnumeral': {
            if ('token' in tree) {
                const token = decodeToken(tree.token);
                if (token === null)
                    return null;
                return new ast_1.ChurchNumeral(token);
            }
            return null;
        }
        case 'macro': {
            if ('token' in tree && 'macroTable' in tree) {
                const token = decodeToken(tree.token);
                if (token === null || isValidMacroTable(tree.macroTable))
                    return null;
                return new ast_1.Macro(token, tree.macroTable);
            }
            return null;
        }
        case 'variable': {
            if ('token' in tree) {
                const token = decodeToken(tree.token);
                if (token === null)
                    return null;
                return new ast_1.Variable(token);
            }
            return null;
        }
        default:
            return null;
    }
}
exports.decodeSafe = decodeSafe;
function decodeToken(maybeToken) {
    if (typeof maybeToken === 'object'
        &&
            'type' in maybeToken
        &&
            'value' in maybeToken
        &&
            'position' in maybeToken
        &&
            isValidTokenType(maybeToken.type)
        &&
            (typeof maybeToken.value === 'string' || typeof maybeToken.value === 'number')
        &&
            isValidPosition(maybeToken.position)) {
        return new lexer_1.Token(maybeToken.type, maybeToken.value, maybeToken.position);
    }
    return null;
}
function isValidTokenType(maybeType) {
    return (typeof maybeType === 'string'
        &&
            Object.values(lexer_1.TokenType).some((val) => maybeType === val));
}
function isValidPosition(maybePosition) {
    return (typeof maybePosition === 'object'
        &&
            'column' in maybePosition
        &&
            typeof maybePosition.column === 'number'
        &&
            'row' in maybePosition
        &&
            typeof maybePosition.row === 'number'
        &&
            'position' in maybePosition
        &&
            typeof maybePosition.position === 'number');
}
function isValidMacroTable(maybeMacroTable) {
    if (typeof maybeMacroTable !== 'object') {
        return false;
    }
    return Object.entries(maybeMacroTable).every(([key, value]) => typeof value === 'string');
}
