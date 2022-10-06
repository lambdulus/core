import { NormalEvaluator } from './normalevaluator';
import { ApplicativeEvaluator } from './applicativeevaluator';
import { OptimizeEvaluator } from './optimizeevaluator';
import { NormalAbstractionEvaluator } from './normalabstractionevaluator';
export { NormalEvaluator } from './normalevaluator';
export { ApplicativeEvaluator } from './applicativeevaluator';
export { OptimizeEvaluator } from './optimizeevaluator';
export { NormalAbstractionEvaluator } from './normalabstractionevaluator';
export declare type Evaluator = NormalEvaluator | ApplicativeEvaluator | OptimizeEvaluator | NormalAbstractionEvaluator;
