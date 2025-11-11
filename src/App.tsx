import { ChangeEvent, RefObject, useRef, useState } from "react";
import SoSBoard from "./components/SoSBoard";
import ThreeColumnLayout from "./components/ThreeColumnLayout";
import { GeneralSoSGame, SimpleSoSGame } from "./features/sosGame";
import { Player } from "./features/player";

const BOARD_SIZES = [
  [3,3],
  [4,4],
  [5,5],
  [6,6],
  [7,7],
  [8,8]
]

const bluePlayer = new Player("Blue Player","S")
const redPlayer = new Player("Red Player" ,"O")

let sosGame = new SimpleSoSGame([bluePlayer, redPlayer], bluePlayer)

function App() {
  const [displayedSize, setDisplayedSize] = useState(sosGame.board.size)
  const [displayedPlayersTurn, setDisplayedPlayersTurn] = useState(sosGame.getWhoseTurnIsIt().getPlayerName())

  const bluePlayerSymbolInput = {
    ref: useRef<HTMLFormElement>(null),
    inputName: "blue-player-symbol"
  }

  const redPlayerSymbolInput = {
    ref: useRef<HTMLFormElement>(null),
    inputName: "red-player-symbol"
  }
  
  const switchDisplayedPlayersTurn = (nextPlayerTurn: Player) => {
    setDisplayedPlayersTurn(nextPlayerTurn.getPlayerName())
  }

  const selectPlayerSymbol = (playerSymbolInput : {ref: RefObject<HTMLFormElement | null>, inputName: string}, player: Player) => {
    
    if (playerSymbolInput.ref.current) {
      const selectedPlayerSymbol = (playerSymbolInput.ref.current.querySelector(`input[name="${playerSymbolInput.inputName}"]:checked`)) as HTMLInputElement
      player.setPlayerSymbol(selectedPlayerSymbol.value)
    }    

    console.log(`${player.getPlayerName()} Symbol =  ${player.getPlayerSymbol()}`)
  }

  const selectBoardSize = (e: ChangeEvent<HTMLSelectElement>) => {
    const boardSize = Number(e.target.value)
    sosGame.board.setBoardSize(boardSize, boardSize)
    setDisplayedSize([boardSize, boardSize])
  }
  
  const selectGameMode = (e: ChangeEvent<HTMLInputElement>) => {
    const setGameMode = e.target.value

    console.log(setGameMode)
    if (setGameMode == "SIMPLE") {
      sosGame = new SimpleSoSGame([bluePlayer, redPlayer], bluePlayer) 
    } else if (setGameMode == "GENERAL") {
      sosGame = new GeneralSoSGame([bluePlayer, redPlayer], bluePlayer) 
    }
  }

  return (
    <main>
      <ThreeColumnLayout layoutLevel="root" gap="16px">
        <ThreeColumnLayout.LeftColumn columnPercent={25}>
          <p>Blue Player</p>
          
          <form ref={bluePlayerSymbolInput.ref}>
            <label><input type='radio' name={bluePlayerSymbolInput.inputName} onChange={() => {selectPlayerSymbol(bluePlayerSymbolInput, bluePlayer)}} value="S" defaultChecked={true}></input>S</label>
            <label><input type='radio' name={bluePlayerSymbolInput.inputName} onChange={() => {selectPlayerSymbol(bluePlayerSymbolInput, bluePlayer)}} value="O"></input>O</label>
          </form>
          
        </ThreeColumnLayout.LeftColumn>

        <ThreeColumnLayout.MiddleColumn columnPercent={50}>
          <div className="flex gap-6">
            <form className="flex gap-3">
              <label><input type='radio' name="game-mode" onChange={selectGameMode} defaultChecked={true} value="SIMPLE"></input>Simple Game</label>
              <label><input type='radio' name="game-mode" onChange={selectGameMode} value="GENERAL"></input>General Game</label>
            </form>

            <label htmlFor="board-sizes">Board Size:</label>
            <select id="board-sizes" onChange={selectBoardSize}>
              {BOARD_SIZES.map(size => {
                const rowCount = size[0]
                const columnCount = size[1]

                return (
                  <option value={rowCount}>{rowCount}x{columnCount}</option>
                )
              })}
            </select>
          </div>

          <div>
            <span className="hidden">{displayedSize}</span>
            <SoSBoard sosGame={sosGame} switchDisplayedPlayersTurn={switchDisplayedPlayersTurn}/>
          </div>

          <p>Current Turn: {displayedPlayersTurn}</p>

        </ThreeColumnLayout.MiddleColumn>

        <ThreeColumnLayout.RightColumn columnPercent={25}>
          <p>Red Player Column</p>

          <form ref={redPlayerSymbolInput.ref}>
            <label><input type='radio' name={redPlayerSymbolInput.inputName} onChange={() => {selectPlayerSymbol(redPlayerSymbolInput, redPlayer)}} value="S"></input>S</label>
            <label><input type='radio' name={redPlayerSymbolInput.inputName} onChange={() => {selectPlayerSymbol(redPlayerSymbolInput, redPlayer)}} value="O" defaultChecked={true}></input>O</label>
          </form>
        </ThreeColumnLayout.RightColumn>
      </ThreeColumnLayout>
    </main>
  );
}

export default App;
