import Parser, { AST, Visitable } from '../parser/parser'
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
  // asside from that
  // visitors can have some internal state and private helper methods
}

export class BasicPrinter implements Visitor {
  private expression : string = ''

  // TODO: tohle mozna nebude fungovat, tak s tim musim pocitat jo
  private printLambdaBody (lambda : Lambda) : void {
    if (lambda.body instanceof Lambda) {
      return this.printLambdaBody(lambda.body)
    }

    this.expression += lambda.body.visit(this)
  }

  // TODO: tohle muze trpet uplne stejnym problemem
  private printLambdaArguments (lambda : Lambda, accumulator : string) : void {
    if (lambda.body instanceof Lambda) {
      return this.printLambdaArguments(lambda.body, `${ accumulator } ${ lambda.body.argument.name() }`)
    }
    
    this.expression += accumulator
  }

  constructor (
    public readonly tree : AST & Visitable,
    ) {
      this.tree.visit(this)
    }

  print () : string {
    return this.expression
  }

  onApplication(application: Application): void {
    if (application.right instanceof Application) {
      this.expression += `${ application.left.visit(this) } (${ application.right.visit(this) })`
    }

    this.expression += `${ application.left.visit(this) } ${ application.right.visit(this) }`
  }
  
  onLambda(lambda: Lambda): void {
    if (lambda.body instanceof Lambda) {
      this.expression += `(λ ${ this.printLambdaArguments(lambda, lambda.argument.name()) } . ${ this.printLambdaBody(lambda) })`
    }

    this.expression += `(λ ${ lambda.argument.visit(this) } . ${ lambda.body.visit(this) })`
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
  // some private prop, where i keep next Reduction struct

  constructor (
    public readonly tree : AST
    ) {
    // TODO: here, tree should be traversed and found which reduction should be done
    // this class has some own state
    // property foundReduction [ or similar ]
    // some metadata for that reduction
  }

  nextReduction () : Reduction {
    // TODO: implement or implement in constructor ???
  }

  evaluate (reduction : Reduction) : void {
    // TODO: updates tree
  }

  onApplication(application: Application): void {
    throw new Error("Method not implemented.");
  }
  
  onLambda(lambda: Lambda): void {
    throw new Error("Method not implemented.");
  }

  onChurchNumber(churchnumber: ChurchNumber): void {
    throw new Error("Method not implemented.");
  }

  onMacro(macro: Macro): void {
    throw new Error("Method not implemented.");
  }

  onVariable(variable: Variable): void {
    throw new Error("Method not implemented.");
  }
}