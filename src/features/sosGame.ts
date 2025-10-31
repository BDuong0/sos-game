import { Board } from "./board";

export enum gameModes {
  Simple = "SIMPLE",
  General = "GENERAL",
}

export enum gamePlayers {
    Red = "RED",
    Blue = "BLUE"
}

export enum cellValue {
    S = "S",
    O = "O"
}

export class SoSGame {
    public board: Board
    private gameMode: gameModes 
    private whoseTurn: gamePlayers
    private bluePlayer: Player
    private redPlayer: Player

    constructor(gameMode: gameModes = gameModes.Simple) {
        this.board = new Board()
        this.gameMode = gameMode
        this.whoseTurn = gamePlayers.Blue
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

    public setWhoseTurn(player: gamePlayers) {
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