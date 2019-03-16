import { Lambda } from "../ast";
import { ASTReduction } from ".";
export declare class Alpha extends ASTReduction {
    readonly conversions: Set<Lambda>;
    constructor(conversions: Set<Lambda>);
}
