import { Player } from '../../src/features/player'
import { SimpleSoSGame } from '../../src/features/sosGame'
import { RecordedSoSGame } from '../../src/features/recordedSoSGame'

describe("AC 22.1: Record a simple game between two human players", () => {
  describe("recording an entire simple SoS Game", () => {
    let bluePlayer = new Player("Blue Player", "S");
    let redPlayer = new Player("Red Player", "O");
    let sosPlayers = [bluePlayer, redPlayer]
    let simpleSoSGame = new SimpleSoSGame(sosPlayers, 3, 3, bluePlayer);
    const RecordedSimpleGame = new RecordedSoSGame(simpleSoSGame)

    it("should record all moves made in the entire simple game", () => {
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
      redPlayerMakeMove("S", 1, 1) // Turn #4
      bluePlayerMakeMove("S", 0, 2) // Turn #5
      redPlayerMakeMove("S", 0, 1) // Turn #6
      bluePlayerMakeMove("S", 2, 1) // Turn #7
      redPlayerMakeMove("S", 1, 0) // Turn #8
      bluePlayerMakeMove("O", 1, 2) // Turn #9
      
      expect(RecordedSimpleGame.getRecordedMoves()).to.equal(`1. P1:S:2-0 2. P2:S:2-2 3. P1:O:0-0 4. P2:S:1-1 5. P1:S:0-2 6. P2:S:0-1 7. P1:S:2-1 8. P2:S:1-0 9. P1:O:1-2 `)
    })

    it("should record the game settings for the simple game", () => {
      // I know this indentation is ugly. I can't figure out how to format multi-line strings without zero indentation.
      expect(RecordedSimpleGame.getRecordedGameSettings()).to.equal(
`[gameMode: SIMPLE]
[boardSize: 3x3]
[P1: Blue Player]
[P1 Type: HUMAN]
[P2: Red Player]
[P2 Type: HUMAN]
[Winner: Blue Player]`)
    })

    it("should record the game settings and game turns in a text file", () => {
      // No text file is actually being create. It just exists as a string that will later be passed
      // into some write file function
      expect(RecordedSimpleGame.getTextFileContent()).to.equal(
`[gameMode: SIMPLE]
[boardSize: 3x3]
[P1: Blue Player]
[P1 Type: HUMAN]
[P2: Red Player]
[P2 Type: HUMAN]
[Winner: Blue Player]

1. P1:S:2-0 2. P2:S:2-2 3. P1:O:0-0 4. P2:S:1-1 5. P1:S:0-2 6. P2:S:0-1 7. P1:S:2-1 8. P2:S:1-0 9. P1:O:1-2 `
      )
    })
  })
});