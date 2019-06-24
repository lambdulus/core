import { AST, Binary, Child, Application, Lambda, ChurchNumber, Macro, Variable } from "../ast";
import { ASTVisitor } from "../visitors";
import { Eta } from "../reductions/eta";


export class EtaConverter extends ASTVisitor {
  private parent : Binary | null
  private treeSide : Child | null
  private target : AST
  
  constructor (
    { parent, treeSide, target } : Eta,
    public tree : AST,
  ) {
    super()
    this.parent = parent
    this.treeSide = treeSide
    this.target = target
    this.tree = tree
  }

  perform () : void {
    if (this.parent === null) {
      this.tree = <AST> this.target
    }
    else {
      this.parent[<Child> this.treeSide] = <AST> this.target
    }
  }
}