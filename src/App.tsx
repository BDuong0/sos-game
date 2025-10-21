import { ChangeEvent, useState } from "react";
import { Board } from "./features/board"
import SoSBoard from "./components/SoSBoard";
import ThreeColumnLayout from "./components/ThreeColumnLayout";

const sosBoard = new Board()

const BOARD_SIZES = [
  [3,3],
  [4,4],
  [5,5],
  [6,6],
  [7,7],
  [8,8]
]

function App() {
  const [displayedSize, setDisplayedSize] = useState(sosBoard.size)
  
  const selectBoardSize = (e: ChangeEvent<HTMLSelectElement>) => {
    const boardSize = Number(e.target.value)
    console.log(boardSize)
    sosBoard.setBoardSize(boardSize, boardSize)
    setDisplayedSize([boardSize, boardSize])
  }
  
  return (
    <main>
      <ThreeColumnLayout layoutLevel="root" gap="16px">
        <ThreeColumnLayout.LeftColumn columnPercent={25}>
          <p>Blue Player</p>
          <form>
            <label><input type='radio' name="blue-player-letter" value="S" defaultChecked></input>S</label>
            <label><input type='radio' name="blue-player-letter" value="O"></input>O</label>
          </form>
        </ThreeColumnLayout.LeftColumn>

        <ThreeColumnLayout.MiddleColumn columnPercent={50}>
          <div className="flex gap-6">
            <form className="flex gap-3">
              <label><input type='radio' name="game-mode"></input>Simple Game</label>
              <label><input type='radio' name="game-mode"></input>General Game</label>
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
            <SoSBoard sosBoard={sosBoard}/>
          </div>

        </ThreeColumnLayout.MiddleColumn>

        <ThreeColumnLayout.RightColumn columnPercent={25}>
          <p>Red Player Column</p>
        </ThreeColumnLayout.RightColumn>
      </ThreeColumnLayout>
    </main>
  );
}

export default App;
