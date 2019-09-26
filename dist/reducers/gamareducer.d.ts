import { AST, Binary, Child, Application, Macro } from "../ast";
import { ASTVisitor } from "../visitors";
import { arity, Gama } from "../reductions";
export declare class GamaReducer extends ASTVisitor {
    tree: AST;
    private substituted;
    readonly redexes: Array<Macro | Application>;
    readonly args: Array<AST>;
    readonly parent: Binary | null;
    readonly treeSide: Child | null;
    readonly abstraction: [string, arity];
    constructor({ redexes, args, parent, treeSide, abstraction }: Gama, tree: AST);
    perform(): void;
    static assertReduction({ redexes, args, parent, treeSide, abstraction }: Gama): boolean;
}
