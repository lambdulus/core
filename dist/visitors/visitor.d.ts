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
export declare class NextAlpha implements ReductionVisitable {
    readonly tree: Application;
    readonly child: Child;
    readonly oldName: string;
    readonly newName: string;
    constructor(tree: Application, child: Child, oldName: string, newName: string);
    visit(visitor: ReductionVisitor): void;
}
export declare class NextBeta implements ReductionVisitable {
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
export declare class NextExpansion implements ReductionVisitable {
    readonly parent: Binary | null;
    readonly treeSide: Child | null;
    readonly tree: Expandable;
    constructor(parent: Binary | null, treeSide: Child | null, tree: Expandable);
    visit(visitor: ReductionVisitor): void;
}
export declare class NextNone implements ReductionVisitable {
    visit(visitor: ReductionVisitor): void;
}
export interface ASTVisitable {
    visit(visitor: ASTVisitor): void;
}
export interface ReductionVisitable {
    visit(visitor: ReductionVisitor): void;
}
export declare abstract class Visitor {
}
export interface ASTVisitor extends Visitor {
    onApplication(application: Application): void;
    onLambda(lambda: Lambda): void;
    onChurchNumber(churchnumber: ChurchNumber): void;
    onMacro(macro: Macro): void;
    onVariable(variable: Variable): void;
}
export interface ReductionVisitor extends Visitor {
    onAlpha(alpha: NextAlpha): void;
    onBeta(beta: NextBeta): void;
    onExpansion(expansion: NextExpansion): void;
    onNone(none: NextNone): void;
}
