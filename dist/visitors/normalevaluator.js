"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const variable_1 = require("../parser/ast/variable");
const lambda_1 = require("../parser/ast/lambda");
const freevarsfinder_1 = require("./freevarsfinder");
class NormalEvaluator {
    constructor(tree) {
        this.tree = tree;
        this.parent = null;
        this.child = null;
        this.nextReduction = new _1.NextNone;
        this.tree.visit(this);
    }
    // TODO: remove
    // evaluate () : AST {
    //   if (this.nextReduction instanceof NextAlpha) {
    //     const { tree, child, oldName, newName } = this.nextReduction
    //     tree[<Child> child] = tree[<Child> child].alphaConvert(oldName, newName)
    //     return this.tree
    //   }
    //   else if (this.nextReduction instanceof NextBeta) {
    //     const { parent, treeSide, target, argName, value } = this.nextReduction
    //     const substituted : AST = target.betaReduce(argName, value)
    //     if (parent === null) {
    //       return substituted
    //     }
    //     else {
    //       parent[<Child> treeSide] = substituted
    //       return this.tree
    //     }
    //   }
    //   else if (this.nextReduction instanceof NextExpansion) {
    //     const { parent, treeSide, tree } = this.nextReduction
    //     const expanded : AST = tree.expand()
    //     if (parent === null) {
    //       return expanded
    //     }
    //     else {
    //       parent[<Child> treeSide] = expanded
    //       return this.tree
    //     }
    //   }
    //   else { // instanceof NextNone      
    //     return this.tree
    //   }  
    // }
    onApplication(application) {
        if (application.left instanceof variable_1.Variable) {
            this.parent = application;
            this.child = _1.Child.Right;
            application.right.visit(this);
        }
        else if (application.left instanceof lambda_1.Lambda) {
            const freeVarsFinder = new freevarsfinder_1.FreeVarsFinder(application.right);
            const freeVars = freeVarsFinder.freeVars;
            // const freeVar : string | null = application.right.freeVarName([])
            // if (freeVar && application.left.isBound(freeVar) && application.left.argument.name() !== freeVar) {
            //   // TODO: refactor condition PLS it looks awful
            //   // second third mainly
            //   // TODO: find truly original non conflicting new name probably using number postfixes
            //   this.nextReduction = new NextAlpha(application, Child.Left, freeVar, `_${ freeVar }`)
            // }
            // TODO: now I rename in loop
            // for future - do it in single pass, all of them in single Visitor or something
            // YES in future there has to be something like NextMultiAlpha
            // which would get Map<string, Set<AST>> :> dictionary keyed by freeVarName with Set of every AST Node
            // refering to every occurence of this varName
            // there wont be this loop
            // only map which will connect varName with Set
            // then all varNames with empty Sets ( those are unbound ) will be filtered
            // maybe there is no need for AST Nodes I should think about it
            for (const varName of freeVars) {
                if (application.left.isBound(varName) && application.left.argument.name() !== varName) {
                    this.nextReduction = new _1.NextAlpha(application, _1.Child.Left, varName, `_${varName}`);
                    return;
                }
            }
            // else {
            // search for free Vars in right which are bound in left OK
            // if any, do α conversion and return
            // if none, do β reduction and return
            this.nextReduction = new _1.NextBeta(this.parent, this.child, application.left.body, application.left.argument.name(), application.right);
            // }
        }
        else { // (this.left instanceof Macro || this.left instanceof ChurchNumber)
            this.parent = application;
            this.child = _1.Child.Left;
            if (application.left === null) {
                console.log('error');
                console.log(application);
                console.log();
                console.log();
                console.log(this);
            }
            application.left.visit(this);
        }
    }
    onLambda(lambda) {
        this.parent = lambda;
        this.child = _1.Child.Right;
        lambda.body.visit(this);
    }
    onChurchNumber(churchNumber) {
        this.nextReduction = new _1.NextExpansion(this.parent, this.child, churchNumber);
    }
    onMacro(macro) {
        this.nextReduction = new _1.NextExpansion(this.parent, this.child, macro);
    }
    onVariable(variable) {
        this.nextReduction = new _1.NextNone;
    }
}
exports.NormalEvaluator = NormalEvaluator;
