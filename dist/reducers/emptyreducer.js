"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmptyReducer = void 0;
const visitors_1 = require("../visitors");
class EmptyReducer extends visitors_1.ASTVisitor {
    constructor(tree) {
        super();
        this.tree = tree;
    }
    perform() {
        // nothing
    }
}
exports.EmptyReducer = EmptyReducer;
