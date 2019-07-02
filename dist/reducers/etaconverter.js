"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const visitors_1 = require("../visitors");
class EtaConverter extends visitors_1.ASTVisitor {
    constructor({ parent, treeSide, target }, tree) {
        super();
        this.tree = tree;
        this.parent = parent;
        this.treeSide = treeSide;
        this.target = target;
        this.tree = tree;
    }
    perform() {
        if (this.parent === null) {
            this.tree = this.target;
        }
        else {
            this.parent[this.treeSide] = this.target;
        }
    }
}
exports.EtaConverter = EtaConverter;
