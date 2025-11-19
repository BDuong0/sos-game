import { Board, CellValuesType } from "./board";
import { ComputerPlayer, Player } from "./player";
import { computePossibleSoSCombinations } from "./sosCombinations";

const allowedCellValues: CellValuesType<string> = {
  empty: "",
  S: "S",
  O: "O",
};

export abstract class SoSGame {
  public board: Board<string>;
  public turnCount: number = 1
  public winner: Player | undefined
  private players: Player[];
  private whoseTurnIsIt: Player;

  constructor(players: Player[], totalRows: number, totalColumns: number,whoseTurnIsIt: Player) {
    this.board = new Board(allowedCellValues, totalRows, totalColumns, true);
    this.players = players;
    this.turnCount = 0
    this.whoseTurnIsIt = whoseTurnIsIt;
  }

  public getPlayers(): Player[] {
    return this.players;
  }

  public setPlayers(players: Player[]) {
    this.players = players
  }

  public getWhoseTurnIsIt(): Player {
    return this.whoseTurnIsIt;
  }

  public setWhoseTurnIsIt(player: Player | ComputerPlayer) {
    this.whoseTurnIsIt = player;
  }

  public decideNextPlayersTurn() {
    const currentPlayersTurn = this.getWhoseTurnIsIt();

    if (currentPlayersTurn.getPlayerName() == this.getPlayers()[0].getPlayerName()) {
      // Current Turn is on Blue Player so set next turn to Red Player
      return this.getPlayers()[1];
    } else if (currentPlayersTurn.getPlayerName() == this.getPlayers()[1].getPlayerName()) { 
      // Current Turn is on Red Player so set next turn to Blue Player
      return this.getPlayers()[0];
    } else {
      return this.getPlayers()[0]
    }
  };

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

        if (cellOneValue == allowedCellValues.S && cellTwoValue == allowedCellValues.O && cellThreeValue == allowedCellValues.S) {

          // See which player's sosCount we have to increment
          const cellOneOwnedBy = this.board.getCellValue(cellOneIndex[0], cellOneIndex[1])[1]
          const cellTwoOwnedBy = this.board.getCellValue(cellTwoIndex[0], cellTwoIndex[1])[1]
          const cellThreeOwnedBy = this.board.getCellValue(cellThreeIndex[0], cellThreeIndex[1])[1]

          for (let k = 0; k < this.getPlayers().length; k++) {
            const player = this.getPlayers()[k]
            
            // Case 1: All 3 cells of SOS are made by the same player
            if (cellOneOwnedBy == player && cellTwoOwnedBy == player && cellThreeOwnedBy == player) {
              player.sosCount += 1
            // Case 2: Two consecutive cells (SO) of the SOS are made by the same player
            } else if (cellOneOwnedBy == player && cellTwoOwnedBy == player || cellTwoOwnedBy == player && cellThreeOwnedBy == player) {
              player.sosCount += 1
            // Case 3: Draw: No player sosCount is incremented
            } else {
              // console.log('Draw. No player sosCount incremented')
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
    // Whichever Player's sosCount reaches 1 first, wins
    for (let i = 0; i < this.getPlayers().length; i++) {
      if (this.getPlayers()[i].sosCount == 1) {
        this.winner = this.getPlayers()[i]
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
    if (this.turnCount == this.board.totalCells) { // All cells have been filled up
      const playerSoSCounts = this.getPlayers().map(player => player.sosCount)
      
      if(Math.max(...playerSoSCounts) > 0) {
        for (let i = 0; i < this.getPlayers().length; i++) {
          if (this.getPlayers()[i].sosCount == Math.max(...playerSoSCounts)) {
            this.winner = this.getPlayers()[i]
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
