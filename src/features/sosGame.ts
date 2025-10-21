import { Board } from "./board";

export enum gameModes {
  Simple = "SIMPLE",
  General = "GENERAL",
}

export class SoSGame {
    public board: Board
    private gameMode: gameModes 
    private whoseTurn: number

    constructor(gameMode: gameModes = gameModes.Simple) {
        this.board = new Board()
        this.gameMode = gameMode
        this.whoseTurn = 1
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

    public setWhoseTurn(player: number) {
        this.whoseTurn = player
    }
}