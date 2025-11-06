import { Board } from "./board";

export enum gameModes {
  Simple = "SIMPLE",
  General = "GENERAL",
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

    public setGameMode(gameMode: gameModes) {
        this.gameMode = gameMode
    }

    public getWhoseTurn() {
        return this.whoseTurn
    }

    public setWhoseTurn(player: gamePlayers) {
        this.whoseTurn = player
    }
}
