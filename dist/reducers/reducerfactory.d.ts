import { AST } from "../ast";
import { Reductions } from "../visitors";
import { Reducer } from "../visitors/normalevaluator";
export declare namespace ReducerFactory {
    function constructFor(tree: AST, nextReduction: Reductions.ASTReduction): Reducer;
}
