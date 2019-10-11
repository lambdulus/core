import { Token } from '../lexer'
import { AST } from './'
import { MacroDef, MacroTable } from '../parser'
import { ASTVisitor } from '../visitors'


export class Macro extends AST {
  constructor (
    public readonly token : Token,
    // TODO: @dynamic-macros
    // public readonly definition : MacroDef,
    public readonly macroTable : MacroTable,
    public readonly identifier : symbol = Symbol(),
  ) { super() }

  name () : string {
    return `${ this.token.value }`
  }

  clone () : Macro {
    // TODO: @dynamic-macros
    return new Macro(this.token, this.macroTable, this.identifier)
  }

  visit (visitor : ASTVisitor) : void {
    visitor.onMacro(this)
  }
}