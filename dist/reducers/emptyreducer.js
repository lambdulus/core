"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
