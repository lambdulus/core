"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const _1 = require(".");
const parser_1 = require("../parser");
const betareducer_1 = require("./betareducer");
const alphaconvertor_1 = require("./alphaconvertor");
// import Reducer from "./reducer";
// import { Application } from "../ast/application";
// import { Lambda } from "../ast/lambda";
// import { Variable } from "../ast/variable";
// import { Binary, AST } from "../ast";
class Reducer extends _1.ASTVisitor {
    constructor(tree) {
        super();
        this.tree = tree;
    }
    static constructFor(tree, nextReduction) {
        if (nextReduction instanceof _1.Reductions.Beta) {
            return new betareducer_1.BetaReducer(nextReduction, tree);
        }
        else if (nextReduction instanceof _1.Reductions.Alpha) {
            return new alphaconvertor_1.AlphaConvertor(nextReduction, tree);
        }
        else if (nextReduction instanceof _1.Reductions.Expansion) {
            return new Expandor(nextReduction, tree);
        }
        else {
            // throw new Error('There are no Reduction implementations for type' + nextReduction.toString())
            // or
            return new Reducer(tree);
        }
    }
    perform() {
        // nothing
    }
}
class Expandor extends Reducer {
    constructor({ parent, treeSide, target }, tree) {
        super(tree);
        this.expanded = null;
        this.parent = parent;
        this.treeSide = treeSide;
        this.target = target;
        // target.visit(this)
        // if (parent === null) {
        //   this.tree = <AST> this.expanded
        // }
        // else {
        //   parent[<Child> treeSide] = <AST> this.expanded
        //   this.tree = tree
        // }
    }
    // onApplication(application : Application) : void {
    //   // nothing
    // }
    // onLambda(lambda : Lambda) : void {
    //   // nothing
    // }
    onChurchNumber(churchNumber) {
        const codeStyle = { singleLetterVars: true, lambdaLetters: ['λ'] };
        const value = churchNumber.token.value;
        const churchLiteral = `(λ s z .${' (s'.repeat(value)} z)${')'.repeat(value)}`;
        this.expanded = parser_1.parse(__1.Lexer.tokenize(churchLiteral, codeStyle));
    }
    onMacro(macro) {
        // TODO: here I lose token - useful for location and origin of macro - should solve this
        // also consider not clonning
        this.expanded = macro.definition.ast.clone();
    }
    // onVariable(variable : Variable) : void {
    //   // nothing
    // }
    perform() {
        this.target.visit(this);
        if (this.parent === null) {
            this.tree = this.expanded;
        }
        else {
            this.parent[this.treeSide] = this.expanded;
        }
    }
}
exports.Expandor = Expandor;
