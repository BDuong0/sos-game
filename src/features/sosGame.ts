import { Board } from "./board";

export enum gameModes {
  Simple = "SIMPLE",
  General = "GENERAL",
}

export enum gamePlayers {
    Red = "RED",
    Blue = "BLUE"
}

export class SoSGame {
    public board: Board
    private gameMode: gameModes 
    private whoseTurn: gamePlayers

    constructor(gameMode: gameModes = gameModes.Simple) {
        this.board = new Board()
        this.gameMode = gameMode
        this.whoseTurn = gamePlayers.Blue
    }

    public getGameMode(){
        return this.gameMode
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
