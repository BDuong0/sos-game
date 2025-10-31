import { useState } from "react";
import { SoSGame, gamePlayers } from "@/features/sosGame";

type SoSBoardProps = {
  sosGame: SoSGame; 
  switchDisplayedPlayersTurn: (nextPlayerTurn: gamePlayers) => void;
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
  switchDisplayedPlayersTurn: (nextPlayerTurn: gamePlayers) => void;
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
    if (displayedCellValue == 1) {
      return <span>S</span>;
    } else if (displayedCellValue == 2) {
      return <span>O</span>;
    } else if (displayedCellValue == 0) {
      return <span className="opacity-0">''</span>;
    }
  };

  const isCellOccupied = () => {
    const currentCellValue = sosGame.board.getCellValue(rowIndex, colIndex);

    if (currentCellValue == 1 || currentCellValue == 2) {
      return true;
    } else {
      return false;
    }
  };

  const placeSymbolInCell = () => {
    console.log(`Cell index = [${rowIndex}][${colIndex}]`);

    if (isCellOccupied() == true) return;

    const whoseTurn = sosGame.getWhoseTurn();

    if (whoseTurn == gamePlayers.Blue) {
      sosGame.board.editCellValue(rowIndex, colIndex, 1);
      setDisplayedCellValue(1);

      sosGame.setWhoseTurn(gamePlayers.Red);
      switchDisplayedPlayersTurn(gamePlayers.Red)
    } else if (whoseTurn == gamePlayers.Red) {
      sosGame.board.editCellValue(rowIndex, colIndex, 2);
      setDisplayedCellValue(2);

      sosGame.setWhoseTurn(gamePlayers.Blue);
      switchDisplayedPlayersTurn(gamePlayers.Blue)
    }
  };

  return (
    <li key={colIndex} className="border-2 border-solid border-black">
      <button className="h-full w-full cursor-pointer" onClick={placeSymbolInCell}>
        {displayPlayerSymbol()}
      </button>
    </li>
  );
};
