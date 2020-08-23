import { NormalEvaluator } from './normalevaluator';
import { ApplicativeEvaluator } from './applicativeevaluator';
import { OptimizeEvaluator } from './optimizeevaluator';
export { NormalEvaluator } from './normalevaluator';
export { ApplicativeEvaluator } from './applicativeevaluator';
export { OptimizeEvaluator } from './optimizeevaluator';
export declare type Evaluator = NormalEvaluator | ApplicativeEvaluator | OptimizeEvaluator;
