import { ComputerPlayer, Player } from '../../src/features/player'
import { GeneralSoSGame, SimpleSoSGame } from '../../src/features/sosGame'
import { recordedSimpleGame } from './simple-game-HH';

describe("AC 23.1 Replaying a simple game between two human players", () => {  
    const textInputBlob = new Blob([recordedSimpleGame], { type: "text/plain" });
    it("should open a text file", async () => {
        const reader = new FileReader();
        reader.onload = () => {
            const text = reader.result 
            const lineCount = text.split('\n').length;
            expect(lineCount).to.equal(9)
        };

        reader.readAsText(textInputBlob);
    })

    it("should change the current SoS game's setting to match the recorded game settings", () => {
        const reader = new FileReader();

        reader.onload = () => {
            let bluePlayer = new Player("Blue Player", "S");
            let redPlayer = new Player("Red Player", "O");
            let sosPlayers = [bluePlayer, redPlayer]
            let sosGameToRender = new SimpleSoSGame(sosPlayers, 3, 3, bluePlayer);
            
            const text = reader.result 
            
            const [gameSettings, recordedTurns] = text.split(/\n\s*\n/)

            let settings = gameSettings.split('\n')
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

            // Make sure that the game type of the SOS game matches the game type in the text file
            if (gameModeValue == "SIMPLE" && sosGameToRender instanceof GeneralSoSGame) {
                sosGameToRender = new SimpleSoSGame(sosPlayers, 3, 3, bluePlayer)
            } else if(gameModeValue == "GENERAL" && sosGameToRender instanceof SimpleSoSGame) {
                sosGameToRender = new GeneralSoSGame(sosPlayers, 3, 3, bluePlayer)
            }

            // Match UI board size to recorded board size
            let [recordedRowCount, recordedColumnCount] = boardSizeValue.split('x')
            recordedRowCount = parseInt(recordedRowCount)
            recordedColumnCount = parseInt(recordedColumnCount)
            if (recordedRowCount != sosGameToRender.board.size[0] && recordedColumnCount != sosGameToRender.board.size[1]) {
                sosGameToRender.board.setBoardSize(recordedRowCount, recordedColumnCount)
            }

            // Make sure that the blue player settings in the UI match the recorded settings
            if (bluePlayer instanceof Player && playerOneTypeValue == "COMPUTER") {
                bluePlayer = new ComputerPlayer()
            } else if (bluePlayer instanceof ComputerPlayer && playerOneTypeValue == "HUMAN") {
                bluePlayer = new Player("Blue Player", "S");
            }

            // Make sure that the red player settings in the UI match the recorded settings
            if (redPlayer instanceof Player && playerTwoTypeValue == "COMPUTER") {
                redPlayer = new ComputerPlayer()
            } else if (redPlayer instanceof ComputerPlayer && playerTwoTypeValue == "HUMAN") {
                redPlayer = new Player("Red Player", "O");
            }

            sosPlayers = [bluePlayer, redPlayer]

            assert.instanceOf(sosGameToRender, SimpleSoSGame)
            expect(sosGameToRender.board.size[0]).to.equal(recordedRowCount)
            expect(sosGameToRender.board.size[1]).to.equal(recordedColumnCount)
            assert.instanceOf(bluePlayer, Player)
            assert.instanceOf(redPlayer, Player)
        };

        reader.readAsText(textInputBlob);
    })


    it("should replay the recorded simple game move by move until completion", () => {
        let bluePlayer = new Player("Blue Player", "S");
        let redPlayer = new Player("Red Player", "O");
        let sosPlayers = [bluePlayer, redPlayer]
        let sosGameToRender = new SimpleSoSGame(sosPlayers, 3, 3, bluePlayer);

        function bluePlayerMakeMove(chosenSymbol, rowIndex, columnIndex) {
            if (chosenSymbol != bluePlayer.getPlayerSymbol()) {
            bluePlayer.setPlayerSymbol(chosenSymbol)
            }
            sosGameToRender.makeMove(bluePlayer, rowIndex, columnIndex)
            sosGameToRender.detectSOSMade(rowIndex, columnIndex)
            
            if (sosGameToRender.determineWinner() != undefined) {
                return
            } else {
            sosGameToRender.turnCount += 1  
            }
        }

        function redPlayerMakeMove(chosenSymbol, rowIndex, columnIndex) {
            if (chosenSymbol != redPlayer.getPlayerSymbol()) {
            redPlayer.setPlayerSymbol(chosenSymbol)
            }
            sosGameToRender.makeMove(redPlayer, rowIndex, columnIndex)
            sosGameToRender.detectSOSMade(rowIndex, columnIndex)
            
            if (sosGameToRender.determineWinner() != undefined) {
                return
            } else {
            sosGameToRender.turnCount += 1  
            }
        }

        const reader = new FileReader();

        reader.onload = () => {
            const text = reader.result 
            
            let [gameSettings, recordedTurns] = text.split(/\n\s*\n/)

            recordedTurns = recordedTurns.split(' ')
            recordedTurns.pop() // Remove the ' ' at the end of recordedTurns before it was recordedTurns.split(' )
            
            const recordedMoves = []

            for (const item of recordedTurns) {
                if (/^\d+\.?$/.test(item)) { // "Test if string is '1' or '1.'"
                    ;
                } else { // We want only strings like "P1:0:1-2"
                    recordedMoves.push(item);
                }
            }

            // Replay each recorded move
            for (let i = 0; i < recordedMoves.length; i++) {
                const [player, symbol, cellIndex] = recordedMoves[i].split(':')
                let [rowIndex, columnIndex] = cellIndex.split("-")
                rowIndex = parseInt(rowIndex)
                columnIndex = parseInt(columnIndex)

                // console.log(player, symbol, typeof(rowIndex), typeof(columnIndex))

                if (player == "P1") {
                    bluePlayerMakeMove(symbol, rowIndex, columnIndex)
                } else if (player == "P2") {
                    redPlayerMakeMove(symbol, rowIndex, columnIndex)
                }
            }

            expect(sosGameToRender.winner).to.equal(bluePlayer)
        };        

        reader.readAsText(textInputBlob);
    })
  
});