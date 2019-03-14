import { ASTVisitor } from "../visitors"

export { Application } from './application'
export { Lambda } from './lambda'
export { ChurchNumber } from './churchnumber'
export { Macro } from './macro'
export { Variable } from './variable'


export enum Child {
  Left = 'left',
  Right = 'right',
}

export interface Binary extends AST {
  left : AST,
  right : AST,
}

export interface AST {
  identifier : symbol,
  clone () : AST,
  visit (visitor : ASTVisitor) : void,
}