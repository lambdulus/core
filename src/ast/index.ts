import { ASTVisitor } from "../visitors";

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