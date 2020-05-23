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
    ALPHA = 0,
    BETA = 1,
    EXPANSION = 2,
    ETA = 3,
    NONE = 4,
    GAMA = 5
}
