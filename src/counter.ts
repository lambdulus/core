export interface PositionRecord {
  column : number
  row : number

  position : number
}

export default class Counter {
  public column : number = 0
  public row : number = 0

  public position : number = 0

  history : Array<PositionRecord> = []

  toRecord () : PositionRecord {
    return { column : this.column, row : this.row, position : this.position }
  }

  newLine () : void {
    this.history.push({ column : this.column, row : this.row, position : this.position })

    this.column = 0
    this.row++
    this.position++
  }

  nextChar () : void {
    this.history.push({ column : this.column, row : this.row, position : this.position })

    this.column++
    this.position++
  }

  rewind () : void {
    const previous = this.history.pop()

    this.row = previous.row
    this.column = previous.column
    this.position = previous.position
  }
}