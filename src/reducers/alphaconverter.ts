import { Token } from "../lexer"
import { AST, Application, Lambda, ChurchNumeral, Macro, Variable } from "../ast"
import { ASTVisitor } from "../visitors"
import { Alpha } from "../reductions"
import { UsedVarNamesFinder } from "../visitors/usedvarnamesfinder"


export class AlphaConverter extends ASTVisitor {
  // Need to do this Nonsense Dance
  private converted : AST | null = null

  private oldName : string = ''
  private newName : string = ''

  public readonly conversions : Set<Lambda>
  
  constructor (
    { conversions } : Alpha,
    public tree : AST
  ) {
    super()
    this.conversions = conversions
  }

  onApplication(application : Application) : void {
    application.left.visit(this)

    const left : AST = <AST> this.converted

    application.right.visit(this)

    const right : AST = <AST> this.converted

    this.converted = new Application(left, right, application.identifier)
  }

  onLambda(lambda : Lambda) : void {
    if (lambda.argument.name() !== this.oldName) {
      lambda.body.visit(this)
      
      const right : AST = <AST> this.converted
      
      lambda.body = right
      this.converted = lambda
    }
    else {
      this.converted = lambda
    }
  }

  onChurchNumeral (churchNumeral : ChurchNumeral) : void {
    this.converted = churchNumeral
  }

  onMacro(macro : Macro) : void {
    this.converted = macro
  }

  onVariable (variable : Variable) : void {
    if (variable.name() === this.oldName) {
      const token : Token = new Token(variable.token.type, this.newName, variable.token.position)
    
      this.converted = new Variable(token, variable.identifier)
    }
    else {
      this.converted = variable
    }
  }

  perform () : void {
    for (const lambda of this.conversions) {
      const usedVarNamesFinder : UsedVarNamesFinder = new UsedVarNamesFinder(lambda)
      const usedNames : Set<string> = usedVarNamesFinder.used

      this.oldName = lambda.argument.name()
      // najit uplne unikatni jmeno uvnitr lambda
      // nejdriv najit vsechna pouzita jmena uvnitr lambda
      // pak vygenerovat nejakou jednoduchou iterativni metodou novej retezec a zkontrolovat na shodu

      this.newName = this.createUniqueName(this.oldName, usedNames)
      // this.newName = `_${this.oldName}` // TODO: create original name

      lambda.argument.visit(this)
      lambda.argument = <Variable> this.converted

      lambda.body.visit(this)
      lambda.body = <AST> this.converted
    }
  }

  createUniqueName(original : string, usedNames : Set<string>) : string {
    // TODO: this is dirty quick fix/implementation - possibly refactor later
    let suffix : number = 1
    let varname : string = 'a'
    while (suffix <= 8 && usedNames.has(`${original}${suffix}`)) { // because 9 can't be incremented to 10
      suffix++
    }
    if (suffix >= 10) {
      while (usedNames.has(varname)) {
        varname = String.fromCharCode(varname.charCodeAt(0) + 1)
      }
      return varname
    }
    else {
      return `${original}${suffix}`
    }
  }
}