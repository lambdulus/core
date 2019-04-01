import { AST } from '../ast';


export { AlphaConvertor } from './alphaconvertor'
export { BetaReducer } from './betareducer'
export { Expandor } from './expandor'
export { EmptyReducer } from './emptyreducer'
export { constructFor } from './reducerfactory'

export interface Reducer {
  tree : AST
  perform () : void
}