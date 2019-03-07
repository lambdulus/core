import Parser, { AST, Visitable, Child, NextNone, NextAlpha, NextReduction, NextBeta, Binary, NextExpansion } from '../parser/parser'
import { Application } from '../parser/ast/application'
import { Lambda } from '../parser/ast/lambda'
import { ChurchNumber } from '../parser/ast/churchnumber'
import { Macro } from '../parser/ast/macro'
import { Variable } from '../parser/ast/variable'

export interface Visitor {
  onApplication (application : Application) : void,
  onLambda (lambda : Lambda) : void,
  onChurchNumber (churchnumber : ChurchNumber) : void,
  onMacro (macro : Macro) : void,
  onVariable (variable : Variable) : void,
}

export class BasicPrinter implements Visitor {
  private expression : string = ''

  // TODO: this looks like nonsense
  // maybe solve it with another Visitor
  private printLambdaBody (lambda : Lambda) : void {
    if (lambda.body instanceof Lambda) {
      this.printLambdaBody(lambda.body)
    }
    else {
      lambda.body.visit(this)
    }
  }

  // TODO: this looks like nonsense
  // maybe solve it with another Visitor
  private printLambdaArguments (lambda : Lambda, accumulator : string) : void {
    if (lambda.body instanceof Lambda) {
      this.printLambdaArguments(lambda.body, `${ accumulator } ${ lambda.body.argument.name() }`)
    }
    else {
      this.expression += accumulator
    }
  }

  constructor (
    public readonly tree : AST & Visitable,
    ) {
      this.tree.visit(this)
    }

  print () : string {
    return this.expression
  }

  // TODO: this is ugly as hell
  onApplication(application: Application): void {
    if (application.right instanceof Application) {
      application.left.visit(this)
      this.expression += ` (`
      application.right.visit(this)
      this.expression += `)`
    }
    else {
      application.left.visit(this)
      this.expression += ` `
      application.right.visit(this)
    }
  }
  
  // TODO: this is ugly as hell
  onLambda(lambda: Lambda): void {
    if (lambda.body instanceof Lambda) {
      this.expression += `(λ `
      this.printLambdaArguments(lambda, lambda.argument.name())
      this.expression += ` . `
      this.printLambdaBody(lambda)
      this.expression += `)`
    }
    else {
      this.expression += `(λ `
      lambda.argument.visit(this)
      this.expression += ` . `
      lambda.body.visit(this)
      this.expression += `)`
    }
  }
  
  onChurchNumber(churchNumber: ChurchNumber): void {
    this.expression += churchNumber.name()
  }
  
  onMacro(macro: Macro): void {
    this.expression += macro.name()
  }
  
  onVariable(variable: Variable): void {
    this.expression += variable.name()
  }
}


// TODO:
// myslenka: na kazdou iteraci stromu vytvorim novou instanci NormalEvaluation ?
// pokud ano - dostanu v konstruktoru strom
// pri redukci se muze zmenit root, tim se zmeni muj strom
// az se provede redukce tak si ode me muze vnejsi kod strom zase zpet vzit
// ulozit ho do statu v reactu nebo podobne
// v dalsi iteraci si ho zase vzit a znova iterovat

// jenze je to takovy dost haluz
// slo by to i jinak
// vytvorim jednu instanci na celou exekuci stromu
// ta si drzi strom a kdyz se zavola nextReduction () tak vrati nejakou strukturu s metadaty o redukci
// taky ma metodu na provedeni redukce
// i tohle reseni umozni vzit si strom zvenku a pomoci public getteru a private setteru budu moct strom menit jenom zevnitr
// v reactu si muzu drzet klidne celej tenhle Visitor, protoze proc ne
// pri redukci mi 


export class NormalEvaluation implements Visitor {
  private parent : Binary | null = null
  private child : Child | null = null

  public nextReduction : NextReduction = NextNone

  constructor (
    public readonly tree : AST
    ) {
      this.tree.visit(this)
  }

  evaluate () : AST {
    if (this.nextReduction instanceof NextAlpha) {
      const { tree, child, oldName, newName } = this.nextReduction
      tree[<Child> child] = tree[<Child> child].alphaConvert(oldName, newName)

      return this.tree
    }
    
    else if (this.nextReduction instanceof NextBeta) {
      const { parent, treeSide, target, argName, value } = this.nextReduction
      const substituted : AST = target.betaReduce(argName, value)

      if (parent === null) {
        return substituted
      }
      else {
        parent[<Child> treeSide] = substituted

        return this.tree
      }
    }

    else if (this.nextReduction instanceof NextExpansion) {
      const { parent, treeSide, tree } = this.nextReduction
      const expanded : AST = tree.expand()

      if (parent === null) {
        return expanded
      }
      else {
        parent[<Child> treeSide] = expanded

        return this.tree
      }
    }

    else { // instanceof NextNone
      return this.tree
    }  
  }

  onApplication(application: Application): void {
    if (application.left instanceof Variable) {
      this.parent = application
      this.child = Child.Right
      application.right.visit(this)
    }

    else if (application.left instanceof Lambda) {
      const freeVar : string | null = application.right.freeVarName([])

      if (freeVar && application.left.isBound(freeVar) && application.left.argument.name() !== freeVar) {
        // TODO: refactor condition PLS it looks awful
        // second third mainly
        // TODO: find truly original non conflicting new name probably using number postfixes
        this.nextReduction = new NextAlpha(application, Child.Left, freeVar, `_${ freeVar }`)
      }
      else {
        // search for free Vars in right which are bound in left OK
        // if any, do α conversion and return
  
        // if none, do β reduction and return
        this.nextReduction = new NextBeta(this.parent, this.child, application.left.body, application.left.argument.name(), application.right)
      }
    }

    else { // (this.left instanceof Macro || this.left instanceof ChurchNumber)
      this.parent = application
      this.child = Child.Left
      application.left.visit(this)
    }
  }
  
  onLambda(lambda: Lambda): void {
    this.parent = lambda
    this.child = Child.Right

    lambda.body.visit(this)
  }

  onChurchNumber(churchNumber: ChurchNumber): void {
    this.nextReduction = new NextExpansion(this.parent, this.child, churchNumber)
  }

  onMacro(macro: Macro): void {
    this.nextReduction = new NextExpansion(this.parent, this.child, macro)
  }

  onVariable(variable: Variable): void {
    this.nextReduction = new NextNone
  }
}