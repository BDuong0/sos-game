export type CellValuesType<V> = { empty: V } & Record<string, V>;

export class Board<T> {
  public grid: (keyof CellValuesType<T> | [keyof CellValuesType<T>, any])[][];
  public size: number[];

  constructor(
    public readonly cellValues: CellValuesType<T>,
    private rows: number = 3,
    private columns: number = 3,
    private setCellValuesAsArray: boolean = false
  ) {
    this.rows = this.isBoardSizeValid(rows, columns) ? rows : 3;
    this.columns = this.isBoardSizeValid(rows, columns) ? columns : 3;
    this.setCellValuesAsArray = setCellValuesAsArray

    const initialCellValue = this.createInitialCellValue();
    this.grid = Array.from({ length: this.rows }, () => Array(this.columns).fill(initialCellValue));
    this.size = [this.rows, this.columns];
  }

  private createInitialCellValue(): keyof CellValuesType<T> | [keyof CellValuesType<T>, any] {
    const initialCellValue = this.cellValues.empty as keyof CellValuesType<T>

    if (this.setCellValuesAsArray) {
      return [initialCellValue, null]
    }
    else {
      return initialCellValue
    }
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

  public getCellValue(rowIndex: number, columnIndex: number): keyof CellValuesType<T> | [keyof CellValuesType<T>, any] {
    return this.grid[rowIndex][columnIndex]
  }

  public editCellValue(rowIndex: number, columnIndex: number, value: keyof CellValuesType<T> | [keyof CellValuesType<T>, any]) {
    this.grid[rowIndex][columnIndex] = value
  }
}
