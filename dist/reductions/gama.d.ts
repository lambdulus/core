import { ASTReduction, ASTReductionType } from ".";
import { Binary, Child, AST, Macro, Application } from "../ast";
export declare type arity = number;
export declare class Gama implements ASTReduction {
    readonly redexes: Array<Macro | Application>;
    readonly args: Array<AST>;
    parent: Binary | null;
    treeSide: Child | null;
    readonly abstraction: [string, arity];
    type: ASTReductionType;
    constructor(redexes: Array<Macro | Application>, // TODO: consider redexes : List<Application>
    args: Array<AST>, parent: Binary | null, treeSide: Child | null, // na jaky strane pro parenta je redukovanej uzel
    abstraction: [string, arity]);
}
