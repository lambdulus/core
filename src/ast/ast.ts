import { ASTVisitor } from "../visitors";
import { BasicPrinter } from "../visitors/basicprinter";


export enum Child {
  Left = 'left',
  Right = 'right',
}

export interface Binary extends AST {
  left : AST,
  right : AST,
}

export abstract class AST {
  abstract identifier : symbol
  abstract clone () : AST
  abstract visit (visitor : ASTVisitor) : void

  toString () : string {
    const printer : BasicPrinter = new BasicPrinter(this)
  
    return printer.print()
  }
}