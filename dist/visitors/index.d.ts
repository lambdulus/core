import { Lambda } from "../ast/lambda";
import { Binary, AST } from "../ast";
import { Application } from "../ast/application";
import { ChurchNumber } from "../ast/churchnumber";
import { Variable } from "../ast/variable";
import { Macro } from "../ast/macro";
export declare enum Child {
    Left = "left",
    Right = "right"
}
export declare namespace Reductions {
    abstract class ASTReduction {
    }
    class Alpha extends ASTReduction {
        readonly conversions: Set<Lambda>;
        constructor(conversions: Set<Lambda>);
    }
    class Beta extends ASTReduction {
        readonly parent: Binary | null;
        readonly treeSide: Child | null;
        readonly target: AST;
        readonly argName: string;
        readonly value: AST;
        constructor(parent: Binary | null, treeSide: Child | null, // na jaky strane pro parenta je redukovanej uzel
        target: AST, // EXPR ve kterem se provede nahrada
        argName: string, value: AST);
    }
    class Expansion extends ASTReduction {
        readonly parent: Binary | null;
        readonly treeSide: Child | null;
        readonly target: AST;
        constructor(parent: Binary | null, treeSide: Child | null, target: AST);
    }
    class None extends ASTReduction {
    }
}
export interface ASTVisitable {
    visit(visitor: ASTVisitor): void;
}
export declare abstract class ASTVisitor {
    onApplication(application: Application): void;
    onLambda(lambda: Lambda): void;
    onChurchNumber(churchNumber: ChurchNumber): void;
    onMacro(macro: Macro): void;
    onVariable(variable: Variable): void;
}
