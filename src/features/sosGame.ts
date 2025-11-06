import { Board, CellValuesType } from "./board";
import { Player } from "./player";

const allowedCellValues: CellValuesType<string> = {
    empty: "",
    S: "S",
    O: "O"
}

export abstract class SoSGame {
    public board: Board<string>
    private players: Player[]
    private whoseTurnIsIt: Player

    constructor(players: Player[], whoseTurnIsIt: Player) {
        this.board = new Board(allowedCellValues, 3, 3, true)
        this.players = players
        this.whoseTurnIsIt = whoseTurnIsIt
    }

    public getPlayers(): Player[] {
        return this.players
    }

    public getWhoseTurnIsIt(): Player {
        return this.whoseTurnIsIt
    }

    public setWhoseTurnIsIt(player: Player) {
        this.whoseTurnIsIt = player
    }   

    private isCellOccupied (rowIndex: number, columnIndex: number) {
        const currentCellValue = this.board.getCellValue(rowIndex, columnIndex);

        if (currentCellValue != this.board.cellValues.empty) {
            return true;
        } else {
            return false;
        }
    };

    public placeSymbolInEmptyCell(rowIndex: number, columnIndex: number) {
        this.board.editCellValue(rowIndex, columnIndex, this.whoseTurnIsIt.getPlayerSymbol())

        if (this.isCellOccupied(rowIndex, columnIndex) == true) return;

        this.board.editCellValue(rowIndex, columnIndex, this.getWhoseTurnIsIt().getPlayerSymbol())
    }

    public getWhoseTurn() {
        return this.whoseTurn
    }

    public setWhoseTurn(player: gamePlayers) {
        this.whoseTurn = player
    }
}
