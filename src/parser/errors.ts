// Every parser failure is a typed object, never a string. Messages match
// the historical strings verbatim so surfaced text does not change.

export class UnexpectedToken extends Error {
  constructor (
    public readonly expected : string,
    public readonly found? : string,
  ) {
    super(`Was expecting ${ expected }` + (found !== undefined ? `, but got ${ found }` : ''))
  }
}

export class MacroAsArgument extends Error {
  constructor (public readonly macroName : string) {
    super('Known Macro name can not stand as an argument name.')
  }
}

export class UnmatchedParenthesis extends Error {
  constructor () {
    super('It seems you have one or more closing parenthesis not matching.')
  }
}

export class MissingParenthesis extends Error {
  constructor () {
    super('It seems like you forgot to write one or more closing parentheses.')
  }
}

export class EmptyExpression extends Error {
  constructor (public readonly position : number) {
    super(
      'You are trying to parse empty expression, which is forbidden. ' +
      'Check your λ expression for empty perenthesis. ' + position
    )
  }
}

export class RedefinedBuiltinMacro extends Error {
  constructor (public readonly macroName : string) {
    super('Cannot redefine built-in Macro [ ' + macroName + ' ]')
  }
}

export class OpenMacroDefinition extends Error {
  constructor (
    public readonly macroName : string,
    public readonly freeVariables : Array<string>,
  ) {
    super(
      `Macro "${ macroName }" is not a closed term ` +
      `(free variables: ${ freeVariables.join(', ') }). ` +
      `Macro definitions must be closed: bind them with λ or remove them.`
    )
  }
}
