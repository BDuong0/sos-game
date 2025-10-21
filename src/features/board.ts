export class Board {
  public grid: number[][];
  public size: number[];

  constructor(
    private rows: number = 3,
    private columns: number = 3,
  ) {
    this.rows = this.isBoardSizeValid(rows, columns) ? rows : 3;
    this.columns = this.isBoardSizeValid(rows, columns) ? columns : 3;
    this.grid = Array.from({ length: this.rows }, () => Array(this.columns).fill(0));
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
}
