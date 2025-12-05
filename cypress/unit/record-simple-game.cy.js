import { ComputerPlayer, Player } from '../../src/features/player'
import { SimpleSoSGame } from '../../src/features/sosGame'

describe.only("AC 2.1: Record a simple game between two human plahyers", () => {
  
  describe("recording an entire simple SoS Game", () => {
    let bluePlayer = new Player("Blue Player", "S");
    let redPlayer = new Player("Red Player", "O");
    let sosPlayers = [bluePlayer, redPlayer]
    let simpleSoSGame = new SimpleSoSGame(sosPlayers, 3, 3, bluePlayer);

    it("should record all moves made in the entire simple game", () => {
      
      let recordedMoves = ``
  
      const sosTurnRecorder = simpleSoSGame.latestMoveSubject.subscribe((latestMove) => {
        // Everytime the SoSGame.latestValidMove changes, this function will process the new value
        // of SoSGame.latestValidMove, so every completed SoS Game turn gets recorded into one long string
        if (latestMove.length == 0) return
        
        const [turnCount, currentPlayerTurn, rowIndex, columnIndex] = latestMove
        const recordedTurn = `${turnCount}. ${currentPlayerTurn.getPlayerName() == "Blue Player" ? "P1" : "P2"}:${currentPlayerTurn.getPlayerSymbol()}:${rowIndex}-${columnIndex} `
        recordedMoves += recordedTurn
      });
  
      function bluePlayerMakeMove(chosenSymbol, rowIndex, columnIndex) {
        if (chosenSymbol != bluePlayer.getPlayerSymbol()) {
          bluePlayer.setPlayerSymbol(chosenSymbol)
        }
        simpleSoSGame.makeMove(bluePlayer, rowIndex, columnIndex)
        simpleSoSGame.detectSOSMade(rowIndex, columnIndex)
        
        if (simpleSoSGame.determineWinner() != undefined) {
          return
        } else {
          simpleSoSGame.turnCount += 1  
        }
      }
  
      function redPlayerMakeMove(chosenSymbol, rowIndex, columnIndex) {
        if (chosenSymbol != redPlayer.getPlayerSymbol()) {
          redPlayer.setPlayerSymbol(chosenSymbol)
        }
        simpleSoSGame.makeMove(redPlayer, rowIndex, columnIndex)
        simpleSoSGame.detectSOSMade(rowIndex, columnIndex)
        
        simpleSoSGame.turnCount += 1
      }
      
      bluePlayerMakeMove("S", 2, 0) // Turn #1
      redPlayerMakeMove("S", 2, 2) // Turn #2
      bluePlayerMakeMove("O", 0, 0) // Turn #3
      redPlayerMakeMove("O", 1, 1) // Turn #4
      bluePlayerMakeMove("S", 0, 2) // Turn #5
      redPlayerMakeMove("S", 0, 1) // Turn #6
      bluePlayerMakeMove("O", 1, 0) // Turn #7f
      redPlayerMakeMove("O", 2, 1) // Turn #8
      bluePlayerMakeMove("O", 1, 2) // Turn #9
      
      expect(recordedMoves).to.equal(`1. P1:S:2-0 2. P2:S:2-2 3. P1:O:0-0 4. P2:O:1-1 5. P1:S:0-2 6. P2:S:0-1 7. P1:O:1-0 8. P2:O:2-1 9. P1:O:1-2 `)
    })

    it("should record the game settings for the simple game", () => {
      let recordedGameSettings = ``
      
      // I know this indentation is ugly. I can't figure out how to format multi-line strings without zero indentation.
      recordedGameSettings =    
`[gameMode: ${(simpleSoSGame instanceof SimpleSoSGame) ? "SIMPLE" : "GENERAL"}]
[P1: ${bluePlayer.getPlayerName()}]
[P1 Type: ${bluePlayer instanceof ComputerPlayer ? "COMPUTER" : "HUMAN"}]
[P2: ${redPlayer.getPlayerName()}
[P2 Type: ${redPlayer instanceof ComputerPlayer ? "COMPUTER" : "HUMAN"}]
[Winner: ${simpleSoSGame.determineWinner().getPlayerName()}]`
  
      expect(recordedGameSettings).to.equal(
`[gameMode: SIMPLE]
[P1: Blue Player]
[P1 Type: HUMAN]
[P2: Red Player
[P2 Type: HUMAN]
[Winner: Blue Player]`)
    })
  })
});