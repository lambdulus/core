import { AST } from "../ast";
export declare type AlowedTypes = Array<any>;
export declare type ArgumentConstraints = Array<AlowedTypes>;
export declare class Abstractions {
    private static knownAbstractions;
    static has(name: string): boolean;
    static getArity(name: string): number;
    static assert(name: string, args: Array<AST>): boolean;
    static evaluate(name: string, args: Array<AST>): AST;
    static inAllowedTypesFor(name: string, n: number, type: any): boolean;
}
