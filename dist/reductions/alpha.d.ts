import { Lambda } from "../ast";
import { ASTReduction, ASTReductionType } from ".";
export declare class Alpha implements ASTReduction {
    readonly conversions: Set<Lambda>;
    type: ASTReductionType;
    constructor(conversions: Set<Lambda>);
}
