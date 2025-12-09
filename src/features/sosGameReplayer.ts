import { RefObject } from "react";
import { ComputerPlayer, Player } from "./player";
import { GeneralSoSGame, SimpleSoSGame, SoSGame } from "./sosGame";


export class SoSGameReplayer {
    private inputTextFile
    private sosGameToRender
    private players
    public cellComponents: RefObject<HTMLDivElement | null>
    public setDisplayedPlayersSoSCount: React.Dispatch<React.SetStateAction<number>>[]
    public switchDisplayedPlayersTurn: (nextPlayerTurn: Player) => void;
    public setDisplayedWinner: React.Dispatch<React.SetStateAction<Player | undefined>>
    
    public setDisplayedBoardSize: React.Dispatch<React.SetStateAction<number[]>>
    public setDisplayedGameMode: React.Dispatch<React.SetStateAction<"SIMPLE" | "GENERAL">>
    public playerSoSCounts: React.Dispatch<React.SetStateAction<number>>[]

    constructor(inputTextFile: File, 
        sosGameToRender: SoSGame, 
        players: Player[], 
        cellComponents: RefObject<HTMLDivElement | null>, 
        setDisplayedPlayersSoSCount: React.Dispatch<React.SetStateAction<number>>[], 
        switchDisplayedPlayersTurn: (nextPlayerTurn: Player) => void, 
        setDisplayedWinner: React.Dispatch<React.SetStateAction<Player | undefined>>,
        setDisplayedBoardSize: React.Dispatch<React.SetStateAction<number[]>>,
        setDisplayedGameMode: React.Dispatch<React.SetStateAction<"SIMPLE" | "GENERAL">>,
        playerSoSCounts: React.Dispatch<React.SetStateAction<number>>[]
    ) {
        this.inputTextFile = inputTextFile
        this.sosGameToRender = sosGameToRender 
        this.players = players
        this.cellComponents = cellComponents
        this.setDisplayedPlayersSoSCount = setDisplayedPlayersSoSCount
        this.switchDisplayedPlayersTurn = switchDisplayedPlayersTurn
        this.setDisplayedWinner = setDisplayedWinner
        this.setDisplayedBoardSize = setDisplayedBoardSize
        this.setDisplayedGameMode = setDisplayedGameMode
        this.playerSoSCounts = playerSoSCounts

        console.log("Loaded Game Settings")
        this.loadGameSettings()
    }

    public loadGameSettings() {
        const reader = new FileReader();

        reader.onload = () => {        
            const text = reader.result 
            
            const [gameSettings, recordedTurns] = (text as string).split(/\n\s*\n/)

            let settings: string[] | string[][] = gameSettings.split('\n')
            for (let i = 0; i < settings.length; i++){
                settings[i] = settings[i].replace(/\[|\]/g, "") // Remove square brackets
                settings[i] = settings[i].replace(/:/g, "") // Remove ':'
            }
            
            settings = settings.map((gameSetting) => {
                const [settingName, settingValue] = gameSetting.split(' ')
                return [settingName, settingValue]
            })

            const [[gameMode, gameModeValue],
            [boardSize, boardSizeValue],
            [playerOneName, playerOneNameValue],
            [playerOneType, playerOneTypeValue],
            [playerTwoName, playerTwoNameValue],
            [playerTwoType, playerTwoTypeValue],
            [winnerName, winnerNameValue]] = settings

            let bluePlayer = this.sosGameToRender.getPlayers()[0]
            let redPlayer = this.sosGameToRender.getPlayers()[1]

            // Make sure that the blue player settings in the UI match the recorded settings
            const [setDisplayedBluePlayerSoSCount, setDisplayedRedPlayerSoSCount] = this.setDisplayedPlayersSoSCount

            // Make sure that the red player settings in the UI match the recorded settings
            if (redPlayer instanceof Player && playerTwoTypeValue == "COMPUTER") {
                redPlayer = new ComputerPlayer(
                    redPlayer.getPlayerName(),
                    redPlayer.getPlayerSymbol(),
                    true,
                    this.sosGameToRender,
                    this.cellComponents, 
                    [setDisplayedBluePlayerSoSCount, setDisplayedRedPlayerSoSCount],
                    this.switchDisplayedPlayersTurn,
                    this.setDisplayedWinner
                )
            } else if (redPlayer instanceof ComputerPlayer && playerTwoTypeValue == "HUMAN") {
                redPlayer = new Player("Red Player", "O");
            }

            this.players = [bluePlayer, redPlayer]

            // Match UI board size to recorded board size
            let [rowCount, columnCount] = boardSizeValue.split('x')
            const recordedRowCount = parseInt(rowCount)
            const recordedColumnCount = parseInt(columnCount)
            console.log(recordedRowCount)
            if (recordedRowCount != this.sosGameToRender.board.size[0] && recordedColumnCount != this.sosGameToRender.board.size[1]) {
                this.sosGameToRender.board.setBoardSize(recordedRowCount, recordedColumnCount)
                this.setDisplayedBoardSize([recordedRowCount, recordedColumnCount])
            }

            // Make sure that the game type of the SOS game matches the game type in the text file
            const [currentRowConut, currentColumnCount] = [this.sosGameToRender.board.size[0], this.sosGameToRender.board.size[1]]
            if (gameModeValue == "SIMPLE" && this.sosGameToRender instanceof GeneralSoSGame) {
                this.sosGameToRender = new SimpleSoSGame(this.players, currentRowConut, currentColumnCount, bluePlayer)                
            } else if(gameModeValue == "GENERAL" && this.sosGameToRender instanceof SimpleSoSGame) {
                this.sosGameToRender = new GeneralSoSGame(this.players, currentRowConut, currentColumnCount, bluePlayer)
            }
        }
        
        reader.readAsText(this.inputTextFile)
    }

    public getSoSGameToRender() {
        return this.sosGameToRender
    }

    public replayMoves(){
        const reader = new FileReader();

        reader.onload = () => {
            const text = reader.result 
            
            let [gameSettings, recordedMoves] = (text as string).split(/\n\s*\n/)

            const recordedTurns = recordedMoves.split(' ')
            recordedTurns.pop() // Remove the ' ' at the end of recordedTurns before it was recordedTurns.split(' )
            
            const recordedMovesWithNoTurnCount = []

            for (const item of recordedTurns) {
                if (/^\d+\.?$/.test(item)) { // "Test if string is '1' or '1.'"
                    ;
                } else { // We want only strings like "P1:0:1-2"
                    recordedMovesWithNoTurnCount.push(item);
                }
            }

            // Replay each recorded move
            for (let i = 0; i < recordedMovesWithNoTurnCount.length; i++) {
                
                const [player, symbol, cellIndex] = recordedMovesWithNoTurnCount[i].split(':')
                let rowIndex: string | number = cellIndex.split("-")[0]
                let columnIndex: string | number = cellIndex.split("-")[1]
                let currentPlayerTurn: Player
                
                rowIndex = parseInt(rowIndex)
                columnIndex = parseInt(columnIndex)
                
                setTimeout(() => {
                    if (player == "P1") {
                        currentPlayerTurn = this.sosGameToRender.getPlayers()[0] // Blue Player
                        this.replayMove(currentPlayerTurn, symbol, rowIndex, columnIndex)
                    } else if (player == "P2") {
                        currentPlayerTurn = this.sosGameToRender.getPlayers()[1] // Red Player
                        this.replayMove(currentPlayerTurn, symbol, rowIndex, columnIndex)
                    }
                }, i * 1000)

            }

        };        

        reader.readAsText(this.inputTextFile);
    }

    private replayMove(currentPlayerTurn: Player, symbol: string, rowIndex: number, columnIndex: number){
        if (symbol != currentPlayerTurn.getPlayerSymbol()) {
            currentPlayerTurn.setPlayerSymbol(symbol)
        }
        
        this.sosGameToRender.makeMove(currentPlayerTurn, rowIndex, columnIndex)

        if (this.cellComponents.current) { // Reflect symbol placed in empty cell in UI
            const boardCell = this.cellComponents.current.querySelector(`[data-cellIndex="${rowIndex} ${columnIndex}"]`)
            if (boardCell) {
                const boardCellValue = boardCell.children[0].children[0]
                
                boardCellValue.outerHTML = `<span>${currentPlayerTurn.getPlayerSymbol()}</span>`
            }
        }

        this.sosGameToRender.detectSOSMade(rowIndex, columnIndex)

        for (let i = 0; i < this.setDisplayedPlayersSoSCount.length ; i++) {
            this.setDisplayedPlayersSoSCount[i](this.sosGameToRender.getPlayers()[i].sosCount)
        }
        
        if (this.sosGameToRender.determineWinner() != undefined) {
            const winner = this.sosGameToRender.determineWinner()
            this.setDisplayedWinner(winner)
        } else {
            this.sosGameToRender.turnCount += 1  
        }
    }
}