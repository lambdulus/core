export class InvalidReductionArguments extends Error {
  constructor (public readonly reduction : string) {
    super(`Invalid arguments of ${ reduction }.`)
  }
}
