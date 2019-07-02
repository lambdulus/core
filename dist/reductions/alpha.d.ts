import { Lambda } from "../ast";
import { ASTReduction } from ".";
export declare class Alpha implements ASTReduction {
    readonly conversions: Set<Lambda>;
    constructor(conversions: Set<Lambda>);
}
