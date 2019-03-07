import { AST, Binary, Expandable } from '../parser';
import { Application } from '../parser/ast/application';
import { Lambda } from '../parser/ast/lambda';
import { ChurchNumber } from '../parser/ast/churchnumber';
import { Macro } from '../parser/ast/macro';
import { Variable } from '../parser/ast/variable';
export declare enum Child {
    Left = "left",
    Right = "right"
}
export declare type NextReduction = NextAlpha | NextBeta | NextExpansion | NextNone;
export declare class NextAlpha {
    readonly tree: Application;
    readonly child: Child;
    readonly oldName: string;
    readonly newName: string;
    constructor(tree: Application, child: Child, oldName: string, newName: string);
}
export declare class NextBeta {
    readonly parent: Binary | null;
    readonly treeSide: Child | null;
    readonly target: AST;
    readonly argName: string;
    readonly value: AST;
    constructor(parent: Binary | null, treeSide: Child | null, // na jaky strane pro parenta je redukovanej uzel
    target: AST, // EXPR ve kterem se provede nahrada
    argName: string, value: AST);
}
export declare class NextExpansion {
    readonly parent: Binary | null;
    readonly treeSide: Child | null;
    readonly tree: Expandable;
    constructor(parent: Binary | null, treeSide: Child | null, tree: Expandable);
}
export declare class NextNone {
}
export interface Visitable {
    visit(visitor: Visitor): void;
}
export interface Visitor {
    onApplication(application: Application): void;
    onLambda(lambda: Lambda): void;
    onChurchNumber(churchnumber: ChurchNumber): void;
    onMacro(macro: Macro): void;
    onVariable(variable: Variable): void;
}
export declare class NormalEvaluation implements Visitor {
    readonly tree: AST;
    private parent;
    private child;
    nextReduction: NextReduction;
    constructor(tree: AST);
    evaluate(): AST;
    onApplication(application: Application): void;
    onLambda(lambda: Lambda): void;
    onChurchNumber(churchNumber: ChurchNumber): void;
    onMacro(macro: Macro): void;
    onVariable(variable: Variable): void;
}
