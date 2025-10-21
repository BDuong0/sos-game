import { Board } from "./board";

export enum gameModes {
  Simple = "SIMPLE",
  General = "GENERAL",
}

export class SoSGame {
    public board: Board
    private gameMode: gameModes 

    constructor(gameMode: gameModes = gameModes.Simple) {
        this.board = new Board()
        this.gameMode = gameMode
    }

    public getGameMode(){
        return this.gameMode
    }

    public setGameMode(gameMode: gameModes) {
        this.gameMode = gameMode
    }
}