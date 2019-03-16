import { AST } from "../ast";
import { Reducer } from "../visitors/normalevaluator";
import { ASTReduction } from "../reductions";
export declare function constructFor(tree: AST, nextReduction: ASTReduction): Reducer;
