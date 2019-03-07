import { AST, Binary } from '..';
import { Visitor } from '../../visitors/visitor';
export declare class Application implements AST, Binary {
    left: AST;
    right: AST;
    readonly identifier: symbol;
    constructor(left: AST, right: AST);
    clone(): Application;
    visit(visitor: Visitor): void;
    alphaConvert(oldName: string, newName: string): AST;
    betaReduce(argName: string, value: AST): AST;
    etaConvert(): AST;
    freeVarName(bound: Array<string>): string | null;
}
