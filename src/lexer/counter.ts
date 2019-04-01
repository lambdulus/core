export interface PositionRecord {
  column : number
  row : number

  position : number
}

export const BlankPosition = {
  column : -1,
  row : -1,
  position : -1,
}

export class Counter {
  public column : number = 0
  public row : number = 0

  public position : number = 0

  toRecord () : PositionRecord {
    return { column : this.column, row : this.row, position : this.position }
  }

  newLine () : void {
    this.column = 0
    this.row++
    this.position++
  }

  nextChar () : void {
    this.column++
    this.position++
  }
}