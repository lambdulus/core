"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ast_1 = require("./ast");
// TODO: in the future - decode even nested members like Token and such
function decode(tree) {
    switch (tree.type) {
        case 'application': {
            const left = tree.left;
            const right = tree.right;
            const leftNode = decode(left);
            const rightNode = decode(right);
            if (leftNode !== null && rightNode !== null) {
                return new ast_1.Application(leftNode, rightNode);
            }
            return null;
        }
        case 'lambda': {
            const left = tree.left;
            const right = tree.right;
            const leftNode = decode(left);
            const rightNode = decode(right);
            if (left.type === 'variable' && leftNode !== null && rightNode !== null) {
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
exports.decode = decode;
