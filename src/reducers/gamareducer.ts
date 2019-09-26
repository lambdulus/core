import { AST, Binary, Child, Application, Macro } from "../ast"
import { ASTVisitor } from "../visitors"
import { arity, Gama } from "../reductions"
import { Abstractions } from "./abstractions"
import { Evaluator } from "../evaluators"


export class GamaReducer extends ASTVisitor {
  private substituted : AST | null = null

  public readonly redexes : Array<Macro | Application> // TODO: consider redexes : List<Application>
  public readonly args : Array<AST>
  public readonly parent : Binary | null
  public readonly treeSide : Child | null // na jaky strane pro parenta je redukovanej uzel
  public readonly abstraction : [ string, arity ]
  
  constructor (
    { redexes, args, parent, treeSide, abstraction } : Gama,
    public tree : AST,
  ) {
    super()
    this.redexes = redexes
    this.args = args
    this.parent = parent
    this.treeSide = treeSide
    this.abstraction = abstraction

    this.tree = tree
  }

  perform () : void {
    const [ name ] = this.abstraction
    this.substituted = Abstractions.evaluate(name, this.args)

    if (this.parent === null) {
      this.tree = <AST> this.substituted
    }
    else {
      this.parent[<Child> this.treeSide] = <AST> this.substituted
    }
  }

  static assertReduction ({ redexes, args, parent, treeSide, abstraction } : Gama) : boolean {
    const [ name ] = abstraction
    if ( ! (Abstractions.has(name))) {
      return false
    }

    return Abstractions.assert(name, args)
  }
}