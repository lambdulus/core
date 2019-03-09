import { AST, Binary } from '../parser';
import { Application } from '../parser/ast/application';
import { Lambda } from '../parser/ast/lambda';
import { ChurchNumber } from '../parser/ast/churchnumber';
import { Macro } from '../parser/ast/macro';
import { Variable } from '../parser/ast/variable';
export declare enum Child {
    Left = "left",
    Right = "right"
}
export declare type NextReduction = ReductionVisitable;
export interface SingleAlpha {
    tree: Lambda;
    oldName: string;
    newName: string;
}
export declare class NextAlpha implements NextReduction {
    readonly conversions: Array<SingleAlpha>;
    constructor(conversions: Array<SingleAlpha>);
    visit(visitor: ReductionVisitor): void;
}
export declare class NextBeta implements NextReduction {
    readonly parent: Binary | null;
    readonly treeSide: Child | null;
    readonly target: AST;
    readonly argName: string;
    readonly value: AST;
    constructor(parent: Binary | null, treeSide: Child | null, // na jaky strane pro parenta je redukovanej uzel
    target: AST, // EXPR ve kterem se provede nahrada
    argName: string, value: AST);
    visit(visitor: ReductionVisitor): void;
}
export declare class NextExpansion implements NextReduction {
    readonly parent: Binary | null;
    readonly treeSide: Child | null;
    readonly target: AST;
    constructor(parent: Binary | null, treeSide: Child | null, target: AST);
    visit(visitor: ReductionVisitor): void;
}
export declare class NextNone implements NextReduction {
    visit(visitor: ReductionVisitor): void;
}
export interface ASTVisitable {
    visit(visitor: ASTVisitor): void;
}
export interface ReductionVisitable {
    visit(visitor: ReductionVisitor): void;
}
export interface ASTVisitor {
    onApplication(application: Application): void;
    onLambda(lambda: Lambda): void;
    onChurchNumber(churchNumber: ChurchNumber): void;
    onMacro(macro: Macro): void;
    onVariable(variable: Variable): void;
}
export interface ReductionVisitor {
    onAlpha(alpha: NextAlpha): void;
    onBeta(beta: NextBeta): void;
    onExpansion(expansion: NextExpansion): void;
    onNone(none: NextNone): void;
}
