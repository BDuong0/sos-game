import { Board, CellValuesType } from "./board";
import { Player } from "./player";

const allowedCellValues: CellValuesType<string> = {
  empty: "",
  S: "S",
  O: "O",
};

export abstract class SoSGame {
  public board: Board<string>;
  private players: Player[];
  private whoseTurnIsIt: Player;

  constructor(players: Player[], whoseTurnIsIt: Player) {
    this.board = new Board(allowedCellValues, 3, 3, true);
    this.players = players;
    this.whoseTurnIsIt = whoseTurnIsIt;
  }

  public getPlayers(): Player[] {
    return this.players;
  }

  public getWhoseTurnIsIt(): Player {
    return this.whoseTurnIsIt;
  }

  public setWhoseTurnIsIt(player: Player) {
    this.whoseTurnIsIt = player;
  }

  private isCellOccupied(rowIndex: number, columnIndex: number) {
    const currentCellValue = this.board.getCellValue(rowIndex, columnIndex)[0];

    if (currentCellValue != this.board.cellValues.empty) {
      return true;
    } else {
      return false;
    }
  }

  public makeMove(currentPlayerTurn: Player, rowIndex: number, columnIndex: number) {
    this.placeSymbolInEmptyCell(currentPlayerTurn, rowIndex, columnIndex);
  };

  public placeSymbolInEmptyCell(currentPlayerTurn: Player, rowIndex: number, columnIndex: number) {
    if (this.isCellOccupied(rowIndex, columnIndex) == true) return;

    const cellOwnedBy = currentPlayerTurn;

    this.board.editCellValue(rowIndex, columnIndex, [cellOwnedBy.getPlayerSymbol(), cellOwnedBy]);
  }

  abstract makeMove(rowIndex: number, columnIndex: number): void;
}

export class SimpleSoSGame extends SoSGame {
  constructor(players: Player[], whoseTurnIsIt: Player) {
    super(players, whoseTurnIsIt);
  }

  public makeMove(rowIndex: number, columnIndex: number) {
    console.log("Implement makeMove() for SimpleSoSGame");
    this.placeSymbolInEmptyCell(rowIndex, columnIndex);
  }
}

export class GeneralSoSGame extends SoSGame {
  constructor(players: Player[], whoseTurnIsIt: Player) {
    super(players, whoseTurnIsIt);
  }

  public makeMove() {
    console.log("Implement makeMove() for GeneralSoSGame");
  }
}
