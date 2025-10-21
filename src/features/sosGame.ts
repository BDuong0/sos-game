import { Board } from "./board";

export enum gameModes {
  Simple = "SIMPLE",
  General = "GENERAL",
}

export class SoSGame {
    public board: Board
    private gameMode: gameModes 
    private whoseTurn: number
    private bluePlayer: Player
    private redPlayer: Player

    constructor(gameMode: gameModes = gameModes.Simple) {
        this.board = new Board()
        this.gameMode = gameMode
        this.whoseTurn = 1
        this.bluePlayer = new Player("S")
        this.redPlayer = new Player("O")
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

type playerSymbols = "S" | "O"

class Player {
    private playerSymbol: playerSymbols

    constructor(playerSymbol: playerSymbols){
        this.playerSymbol = playerSymbol
    }

    public getPlayerSymbol() {
        return this.playerSymbol
    }
}