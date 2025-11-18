import { Board, CellValuesType } from "./board";
import { Player } from "./player";
import { computePossibleSoSCombinations } from "./sosCombinations";

const allowedCellValues: CellValuesType<string> = {
  empty: "",
  S: "S",
  O: "O",
};

export abstract class SoSGame {
  public board: Board<string>;
  public turnCount: number = 1
  public totalCells: number
  private players: Player[];
  private totalRows: number = 3;
  private totalColumns: number = 3;
  private whoseTurnIsIt: Player;

  constructor(players: Player[], totalRows: number, totalColumns: number,whoseTurnIsIt: Player) {
    this.board = new Board(allowedCellValues, totalRows, totalColumns, true);
    this.players = players;
    this.turnCount = 0
    this.totalCells = this.totalRows * this.totalColumns
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

    return [rowIndex, columnIndex]
  };

  public placeSymbolInEmptyCell(currentPlayerTurn: Player, rowIndex: number, columnIndex: number) {
    if (this.isCellOccupied(rowIndex, columnIndex) == true) return;

    const cellOwnedBy = currentPlayerTurn;

    this.board.editCellValue(rowIndex, columnIndex, [cellOwnedBy.getPlayerSymbol(), cellOwnedBy]);
  }

  public detectSOSMade(rowIndex: number, columnIndex: number){
    const sosLocationsToCheck = computePossibleSoSCombinations(this.getWhoseTurnIsIt().getPlayerSymbol(), rowIndex, columnIndex, this)

    // Go through each possible SOS location (vertical, horizontal, and diagonal) to see if SOS is present
    for (let i = 0; i < sosLocationsToCheck.length ; i++) {
      const cellLocations = sosLocationsToCheck[i]
      
      for (let j = 0; j < cellLocations.length ; j++) {
        const [cellOneIndex, cellTwoIndex, cellThreeIndex] = cellLocations[j]
        
        const cellOneValue = this.board.getCellValue(cellOneIndex[0], cellOneIndex[1])[0]
        const cellTwoValue = this.board.getCellValue(cellTwoIndex[0], cellTwoIndex[1])[0]
        const cellThreeValue = this.board.getCellValue(cellThreeIndex[0], cellThreeIndex[1])[0]
        // console.log(cellOneValue, cellTwoValue, cellThreeValue)

        if (cellOneValue == allowedCellValues.S && cellTwoValue == allowedCellValues.O && cellThreeValue == allowedCellValues.S) {
          console.log('SOS detected')

          // See which player's sosCount we have to increment
          const cellOneOwnedBy = this.board.getCellValue(cellOneIndex[0], cellOneIndex[1])[1]
          const cellTwoOwnedBy = this.board.getCellValue(cellTwoIndex[0], cellTwoIndex[1])[1]
          const cellThreeOwnedBy = this.board.getCellValue(cellThreeIndex[0], cellThreeIndex[1])[1]

          for (let k = 0; k < this.getPlayers().length; k++) {
            const player = this.getPlayers()[k]
            
            // Case 1: All 3 cells of SOS are made by the same player
            if (cellOneOwnedBy == player && cellTwoOwnedBy == player && cellThreeOwnedBy == player) {
              player.sosCount += 1
              console.log(`${player.getPlayerName()} sosCount =  ${player.sosCount}`)
            // Case 2: Two consecutive cells (SO) of the SOS are made by the same player
            } else if (cellOneOwnedBy == player && cellTwoOwnedBy == player || cellTwoOwnedBy == player && cellThreeOwnedBy == player) {
              player.sosCount += 1
              console.log(`${player.getPlayerName()} sosCount =  ${player.sosCount}`)
            // Case 3: Draw: No player sosCount is incremented
            } else {
              console.log('Draw. No player sosCount incremented')
              ;
            }
          }
        }
      }
    }
  }

  abstract determineWinner(): Player | undefined
}

export class SimpleSoSGame extends SoSGame {
  constructor(players: Player[], totalRows: number = 3, totalColumns: number = 3,  whoseTurnIsIt: Player) {
    super(players, totalRows, totalColumns, whoseTurnIsIt);
  }

  public determineWinner() {
    console.log("Implement determineWinner() for SimpleSoSGame");

    for (let i = 0; i < this.getPlayers().length; i++) {
      if (this.getPlayers()[i].sosCount == 1) {
        return this.getPlayers()[i]
      }
    }
    
  }
}

export class GeneralSoSGame extends SoSGame {
  constructor(players: Player[], totalRows: number = 3, totalColumns: number = 3,  whoseTurnIsIt: Player) {
    super(players, totalRows, totalColumns, whoseTurnIsIt);
  }

  public determineWinner() {
    console.log("Implement determineWinner() for GeneralSoSGame");
    console.log(`this.totalCells = ${this.totalCells}`)

    if (this.turnCount == this.totalCells) { // All cells have been filled up
      const playerSoSCounts = this.getPlayers().map(player => player.sosCount)
      
      if(Math.max(...playerSoSCounts) > 0) {
        for (let i = 0; i < this.getPlayers().length; i++) {
          if (this.getPlayers()[i].sosCount == Math.max(...playerSoSCounts)) {
            return this.getPlayers()[i]
          }
        }
      } else {
        return undefined
      }
    } else {
      return undefined
    }

  }
}
