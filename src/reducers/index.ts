import { AST } from '../ast'


export { AlphaConverter } from './alphaconverter'
export { BetaReducer } from './betareducer'
export { EtaConverter } from './etaconverter'
export { Expander } from './expander'
export { EmptyReducer } from './emptyreducer'
export { constructFor } from './reducerfactory'
export { InvalidReductionArguments } from './errors'

export interface Reducer {
  tree : AST
  perform () : void
}