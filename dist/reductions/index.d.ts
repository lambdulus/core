export interface ASTReduction {
    type: ASTReductionType;
}
export { Alpha } from './alpha';
export { Beta } from './beta';
export { Expansion } from './expansion';
export { Eta } from './eta';
export { None } from './none';
export { Gama, arity } from './gama';
export declare enum ASTReductionType {
    ALPHA = "ALPHA",
    BETA = "BETA",
    EXPANSION = "EXPANSION",
    ETA = "ETA",
    NONE = "NONE",
    GAMA = "GAMA"
}
