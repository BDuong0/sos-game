export type CellValuesType<V> = { empty: V } & Record<string, V>;

export class Board<T> {
  public grid: T[][];
  public size: number[];

  constructor(
    public readonly cellValues: CellValuesType<T>,
    private rows: number = 3,
    private columns: number = 3,
  ) {
    this.rows = this.isBoardSizeValid(rows, columns) ? rows : 3;
    this.columns = this.isBoardSizeValid(rows, columns) ? columns : 3;
    this.grid = Array.from({ length: this.rows }, () => Array(this.columns).fill(this.cellValues.empty));
    this.size = [this.rows, this.columns];
  }

  private isBoardSizeValid(rows: number, columns: number): boolean {
    if (rows != columns) {
        return false
    }
    
    if (3 <= rows && rows <= 8) {
        return true
    } else {
        return false
    }   
  }

  public setBoardSize(rowCount: number, columnCount: number) {
    this.rows = rowCount;
    this.columns = columnCount;
    this.grid = Array.from({ length: this.rows }, () => Array(this.columns).fill(0));
    this.size = [this.rows, this.columns];
  }

  public getCellValue(rowIndex: number, columnIndex: number) {
    return this.grid[rowIndex][columnIndex]
  }

  public editCellValue(rowIndex: number, columnIndex: number, value: T) {
    this.grid[rowIndex][columnIndex] = value
  }
}
