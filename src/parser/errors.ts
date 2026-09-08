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
