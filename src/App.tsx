import { ChangeEvent, useState } from "react";
import SoSBoard from "./components/SoSBoard";
import ThreeColumnLayout from "./components/ThreeColumnLayout";
import { SoSGame, gameModes } from "./features/sosGame";

const sosGame = new SoSGame

const BOARD_SIZES = [
  [3,3],
  [4,4],
  [5,5],
  [6,6],
  [7,7],
  [8,8]
]

function App() {
  // const [displayedSize, setDisplayedSize] = useState(sosBoard.size)
  const [displayedSize, setDisplayedSize] = useState(sosGame.board.size)
  const [displayedPlayersTurn, setDisplayedPlayersTurn] = useState(sosGame.getWhoseTurn())
  
  const selectBoardSize = (e: ChangeEvent<HTMLSelectElement>) => {
    const boardSize = Number(e.target.value)
    console.log(boardSize)
    sosGame.board.setBoardSize(boardSize, boardSize)
    setDisplayedSize([boardSize, boardSize])
  }
  
  const selectGameMode = (e: ChangeEvent<HTMLInputElement>) => {
    const setGameMode = e.target.value

    if (setGameMode == "SIMPLE") {
      sosGame.setGameMode(gameModes.Simple)
    } else {
      sosGame.setGameMode(gameModes.General)
    }
  }

  return (
    <main>
      <ThreeColumnLayout layoutLevel="root" gap="16px">
        <ThreeColumnLayout.LeftColumn columnPercent={25}>
          <p>Blue Player</p>
          
          <label><input type='radio' name="blue-player-symbol" value="S" defaultChecked={true}></input>S</label>
          <label><input type='radio' name="blue-player-symbol" value="O"></input>O</label>
          
        </ThreeColumnLayout.LeftColumn>

        <ThreeColumnLayout.MiddleColumn columnPercent={50}>
          <div className="flex gap-6">
            <form className="flex gap-3">
              <label><input type='radio' name="game-mode" onChange={selectGameMode} defaultChecked={true} value={gameModes.Simple}></input>Simple Game</label>
              <label><input type='radio' name="game-mode" onChange={selectGameMode} value={gameModes.General}></input>General Game</label>
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
            <SoSBoard sosGame={sosGame} setDisplayedPlayersTurn={setDisplayedPlayersTurn}/>
          </div>

          <p>Current Turn: {displayedPlayersTurn == 1 ? <span>Blue Player</span> : <span>Red Player</span>}</p>

        </ThreeColumnLayout.MiddleColumn>

        <ThreeColumnLayout.RightColumn columnPercent={25}>
          <p>Red Player Column</p>

          <label><input type='radio' name="red-player-symbol" value="S"></input>S</label>
          <label><input type='radio' name="red-player-symbol" value="O" defaultChecked={true}></input>O</label>
        </ThreeColumnLayout.RightColumn>
      </ThreeColumnLayout>
    </main>
  );
}

export default App;
