import { useState } from "react";
import { SoSGame } from "@/features/sosGame";
import { Player } from "@/features/player";

type SoSBoardProps = {
  sosGame: SoSGame; 
  switchDisplayedPlayersTurn: (nextPlayerTurn: Player) => void;
}

const SoSBoard = ({sosGame, switchDisplayedPlayersTurn,}: SoSBoardProps) => {
  
  function showGridCells() {
    return sosGame.board.grid.map((rows, rowIndex) => (
      <li key={rowIndex}>
        <ul>
          {rows.map((columns, colIndex) => (
            <BoardCell
              sosGame={sosGame}
              rowIndex={rowIndex}
              colIndex={colIndex}
              switchDisplayedPlayersTurn={switchDisplayedPlayersTurn}
              key={`[${rowIndex},${colIndex}]`}
            />
          ))}
        </ul>
      </li>
    ));
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${sosGame.board.size[1]}, minmax(0, 1fr))`,
      }}
    >
      {showGridCells()}
    </div>
  );
};

export default SoSBoard;

type BoardCellProps = {
  sosGame: SoSGame;
  rowIndex: number;
  colIndex: number;
  switchDisplayedPlayersTurn: (nextPlayerTurn: Player) => void;
};

const BoardCell = ({
  sosGame,
  rowIndex,
  colIndex,
  switchDisplayedPlayersTurn,
}: BoardCellProps) => {
  const [displayedCellValue, setDisplayedCellValue] = useState(
    sosGame.board.grid[rowIndex][colIndex],
  );

  const displayPlayerSymbol = () => {
    if (displayedCellValue == sosGame.board.cellValues.S) {
      return <span>S</span>;
    } else if (displayedCellValue == sosGame.board.cellValues.O) {
      return <span>O</span>;
    } else if (displayedCellValue == sosGame.board.cellValues.empty) {
      return <span className="opacity-0">''</span>;
    }
  };

  const placeSymbolInCell = (nextPlayersTurn: Player) => {
    console.log(`Cell index = [${rowIndex}][${colIndex}]`);

    const currentPlayersTurn = sosGame.getWhoseTurnIsIt();

    sosGame.makeMove()
    setDisplayedCellValue(currentPlayersTurn.getPlayerSymbol())

    sosGame.setWhoseTurnIsIt(nextPlayersTurn)
    switchDisplayedPlayersTurn(nextPlayersTurn)
  };

  const decideNextPlayersTurn = () => {
    const currentPlayersTurn = sosGame.getWhoseTurnIsIt();
    const [bluePlayer, redPlayer] = sosGame.getPlayers()

    if (currentPlayersTurn == redPlayer) {
      return bluePlayer
    } else {
      return redPlayer
    }
  }

  return (
    <li key={colIndex} className="border-2 border-solid border-black">
      <button className="h-full w-full cursor-pointer" onClick={() => {placeSymbolInCell(decideNextPlayersTurn())}}>
        {displayPlayerSymbol()}
      </button>
    </li>
  );
};
