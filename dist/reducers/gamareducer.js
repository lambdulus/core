"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamaReducer = void 0;
const visitors_1 = require("../visitors");
const abstractions_1 = require("./abstractions");
class GamaReducer extends visitors_1.ASTVisitor {
    constructor({ redexes, args, parent, treeSide, abstraction }, tree) {
        super();
        this.tree = tree;
        this.substituted = null;
        this.redexes = redexes;
        this.args = args;
        this.parent = parent;
        this.treeSide = treeSide;
        this.abstraction = abstraction;
        this.tree = tree;
    }
    perform() {
        const [name] = this.abstraction;
        this.substituted = abstractions_1.Abstractions.evaluate(name, this.args);
        if (this.parent === null) {
            this.tree = this.substituted;
        }
        else {
            this.parent[this.treeSide] = this.substituted;
        }
    }
    static assertReduction({ redexes, args, parent, treeSide, abstraction }) {
        const [name] = abstraction;
        if (!(abstractions_1.Abstractions.has(name))) {
            return false;
        }
        return abstractions_1.Abstractions.assert(name, args);
    }
}
exports.GamaReducer = GamaReducer;
