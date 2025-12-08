import { saveAs } from 'file-saver';
import { ComputerPlayer } from "./player";
import { SimpleSoSGame, SoSGame } from "./sosGame";

export class RecordedSoSGame {
    private sosGame: SoSGame
    private recordedMoves: string
    private recordedGameSettings: string
    private sosTurnRecorder
    private textFileContent: string
    private fileName: string
    
    constructor(sosGame: SoSGame) {
        this.sosGame = sosGame
        this.recordedMoves = ``
        this.recordedGameSettings = ``
        this.sosTurnRecorder = sosGame.latestMoveSubject.subscribe((latestMove) => {
            // Everytime the SoSGame.latestValidMove changes, this function will process the new value
            // of SoSGame.latestValidMove, so every completed SoS Game turn gets recorded into one long string
            if (latestMove.length == 0) return
        
            const [turnCount, currentPlayerTurn, rowIndex, columnIndex] = latestMove
            const recordedTurn = `${turnCount}. ${currentPlayerTurn.getPlayerName() == "Blue Player" ? "P1" : "P2"}:${currentPlayerTurn.getPlayerSymbol()}:${rowIndex}-${columnIndex} `
            this.recordedMoves += recordedTurn
        })
        this.textFileContent = ``
        
        function generateFileName() {
            let gameType = ""
            let playerType = ""    
            
            if (sosGame instanceof SimpleSoSGame) {
                gameType = "simple-game"
            } else {
                gameType = "general-game"
            }

            for (let i = 0; i < sosGame.getPlayers().length; i++){
                if (sosGame.getPlayers()[i] instanceof ComputerPlayer) {
                    playerType += "C"
                } else {
                    playerType += "H"
                }
            }

            return `${gameType}-${playerType}.txt`
        }

        this.fileName = generateFileName()
    }

    public getRecordedMoves() {
        return this.recordedMoves
    }

    public getRecordedGameSettings() {
        const boardSize = `${this.sosGame.board.size[0]}x${this.sosGame.board.size[1]}`
        const bluePlayerName = this.sosGame.getPlayers()[0].getPlayerName()
        const bluePlayerType = this.sosGame.getPlayers()[0] instanceof ComputerPlayer ? "COMPUTER" : "HUMAN"
        const redPlayerName = this.sosGame.getPlayers()[1].getPlayerName()
        const redPlayerType = this.sosGame.getPlayers()[1] instanceof ComputerPlayer ? "COMPUTER" : "HUMAN"
        const winner = this.sosGame.determineWinner()

        this.recordedGameSettings = 
`[gameMode: ${(this.sosGame instanceof SimpleSoSGame) ? "SIMPLE" : "GENERAL"}]
[boardSize: ${boardSize}]
[P1: ${bluePlayerName}]
[P1 Type: ${bluePlayerType}]
[P2: ${redPlayerName}]
[P2 Type: ${redPlayerType}]
[Winner: ${winner == undefined ? "None" : winner.getPlayerName()}]`
        
        return this.recordedGameSettings
    }

    public getTextFileContent() {
        // I don't know how to handle not wanting this method called more than 1 time, because it would make
        // sense fo have 2 copies of the recorded game settings and recorded moves the single text file
        return this.textFileContent += this.getRecordedGameSettings() + `\n\n${this.recordedMoves}`
    }

    public getFileName() {
        return this.fileName
    }

    public downloadTextFile() {
        const file = new Blob([this.getTextFileContent()], { type: 'text/plain;charset=utf-8' });
        saveAs(file, this.getFileName());        
    }
}