import { GamaArg } from "../reductions";
import { AST } from "../ast";
export declare class Abstractions {
    private static knownAbstractions;
    static has(name: string): boolean;
    static getArity(name: string): number;
    static assert(name: string, args: Array<GamaArg>): boolean;
    static evaluate(name: string, args: Array<GamaArg>): AST;
}
