import { NormalEvaluator } from './normalevaluator'
import { ApplicativeEvaluator } from './applicativeevaluator'
import { OptimizeEvaluator } from './optimizeevaluator'
// import { NormalAbstractionEvaluator } from './normalabstractionevaluator' // To Be Deleted

export { NormalEvaluator } from './normalevaluator'
export { ApplicativeEvaluator } from './applicativeevaluator'
export { OptimizeEvaluator } from './optimizeevaluator'
// export { NormalAbstractionEvaluator } from './normalabstractionevaluator' // To Be Deleted

export type Evaluator = NormalEvaluator | ApplicativeEvaluator | OptimizeEvaluator // | NormalAbstractionEvaluator // To Be Deleted