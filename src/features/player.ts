import { RefObject } from "react"
import { SoSGame } from "./sosGame"

export class Player {
    private playerName: string
    public isComputer: boolean
    private playerSymbol: string
    public sosCount: number

    constructor(playerName: string, playerSymbol: string, isComputer: boolean = false){
        this.playerName = playerName
        this.isComputer = isComputer
        this.playerSymbol = playerSymbol
        this.sosCount = 0
    }
    
    public getPlayerName() {
        return this.playerName
    }

    public setPlayerName(newPlayerName: string) {
        this.playerSymbol = newPlayerName
    }

    public getPlayerSymbol() {
        return this.playerSymbol
    }

    public setPlayerSymbol(newPlayerSymbol: string) {
        this.playerSymbol = newPlayerSymbol
    }
}

export class ComputerPlayer extends Player {
    public sosGame: SoSGame
    public cellComponents: RefObject<HTMLDivElement | null>
    public setDisplayedPlayersSoSCount: React.Dispatch<React.SetStateAction<number>>[]
    public switchDisplayedPlayersTurn: (nextPlayerTurn: Player) => void;
    public setDisplayedWinner: React.Dispatch<React.SetStateAction<Player | undefined>>
    
    constructor(playerName: string, playerSymbol: string, isComputer: boolean, sosGame: SoSGame, cellComponents: RefObject<HTMLDivElement | null>, setDisplayedPlayersSoSCount: React.Dispatch<React.SetStateAction<number>>[], switchDisplayedPlayersTurn: (nextPlayerTurn: Player) => void, setDisplayedWinner: React.Dispatch<React.SetStateAction<Player | undefined>>) {
        super(playerName, playerSymbol, isComputer);
        this.sosGame = sosGame
        this.cellComponents = cellComponents
        this.setDisplayedPlayersSoSCount = setDisplayedPlayersSoSCount
        this.switchDisplayedPlayersTurn = switchDisplayedPlayersTurn
        this.setDisplayedWinner = setDisplayedWinner

        this.makeMove()
    }

    private getRandomNumberInclusive(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private getSymbolCoinToss(){
        const randomValue = Math.random();
        return randomValue < 0.5 ? 'S' : 'O';
    }

    public makeMove(){
        if (this.sosGame.winner != undefined) return
        
        if (this.sosGame.getWhoseTurnIsIt().getPlayerName() == this.getPlayerName()) {
            setTimeout(() => {
                const emptyCells: number[][] = []
                this.sosGame.board.grid.map((row, rowIndex) => {
                    row.map((_, columnIndex) => {
                        if (this.sosGame.board.getCellValue(rowIndex, columnIndex)[0] == "") {
                            emptyCells.push([rowIndex, columnIndex])
                        }
                    })
                })

                if (emptyCells.length == 0 || this.sosGame.winner != undefined) {return} // All board cells are filled

                const randomEmptyCellIndex = emptyCells[this.getRandomNumberInclusive(0, emptyCells.length - 1)]
                const randomSymbolToPlace = this.getSymbolCoinToss()
                
                this.setPlayerSymbol(randomSymbolToPlace)

                const filledCellIndex = this.sosGame.makeMove(this, randomEmptyCellIndex[0], randomEmptyCellIndex[1])
    
                if (this.cellComponents.current) { // Reflect symbol placed in empty cell in UI
                    const boardCell = this.cellComponents.current.querySelector(`[data-cellIndex="${randomEmptyCellIndex[0]} ${randomEmptyCellIndex[1]}"]`)
                    if (boardCell) {
                        const boardCellValue = boardCell.children[0].children[0]
                        
                        boardCellValue.outerHTML = `<span>${this.getPlayerSymbol()}</span>`
                    }
                }
    
                this.sosGame.detectSOSMade(filledCellIndex[0], filledCellIndex[1]);
        
                for (let i = 0; i < this.setDisplayedPlayersSoSCount.length ; i++) {
                    this.setDisplayedPlayersSoSCount[i](this.sosGame.getPlayers()[i].sosCount)
                }
    
                this.sosGame.turnCount += 1
    
                const winner = this.sosGame.determineWinner()
    
                if (winner) {
                    this.setDisplayedWinner(winner)
                }

                if (this.sosGame.winner != undefined) return

                const nextPlayersTurn = this.sosGame.decideNextPlayersTurn()
                this.sosGame.setWhoseTurnIsIt(nextPlayersTurn);
                this.switchDisplayedPlayersTurn(nextPlayersTurn);

                if (nextPlayersTurn instanceof ComputerPlayer) {
                    if (this.sosGame.winner == undefined) {
                        nextPlayersTurn.makeMove()
                    }
                } else {
                    // console.log('human opponent')
                }
            }, 1500) 
        }
    }
}