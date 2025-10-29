import { Dispatch, useState } from "react";
import { SoSGame } from "@/features/sosGame";

type SoSBoardProps = {
  sosGame: SoSGame; 
  setDisplayedPlayersTurn: Dispatch<React.SetStateAction<number>>;
}

const SoSBoard = ({sosGame, setDisplayedPlayersTurn,}: SoSBoardProps) => {
  
  function showGridCells() {
    return sosGame.board.grid.map((rows, rowIndex) => (
      <li key={rowIndex}>
        <ul>
          {rows.map((columns, colIndex) => (
            <BoardCell
              sosGame={sosGame}
              rowIndex={rowIndex}
              colIndex={colIndex}
              setDisplayedPlayersTurn={setDisplayedPlayersTurn}
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
  setDisplayedPlayersTurn: Dispatch<React.SetStateAction<number>>;
};

const BoardCell = ({
  sosGame,
  rowIndex,
  colIndex,
  setDisplayedPlayersTurn,
}: BoardCellProps) => {
  const [cellValue, setCellValue] = useState(
    sosGame.board.grid[rowIndex][colIndex],
  );

  const displayPlayerSymbol = () => {
    if (cellValue == 1) {
      return <span>S</span>;
    } else if (cellValue == 2) {
      return <span>O</span>;
    } else if (cellValue == 0) {
      return <span>''</span>;
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

  const handleOnClick = () => {
    console.log(`Cell index = [${rowIndex}][${colIndex}]`);

    if (isCellOccupied() == true) return;

    const whoseTurn = sosGame.getWhoseTurn();

    if (whoseTurn == 1) {
      // Blue player turn to place an O
      sosGame.board.editCellValue(rowIndex, colIndex, 1);
      setCellValue(1);

      sosGame.setWhoseTurn(2);
      setDisplayedPlayersTurn(2);
    } else if (whoseTurn == 2) {
      // Blue player turn to place an O
      sosGame.board.editCellValue(rowIndex, colIndex, 2);
      setCellValue(2);

      sosGame.setWhoseTurn(1);
      setDisplayedPlayersTurn(1);
    }
  };

  return (
    <li key={colIndex} className="border-2 border-solid border-black">
      <button className="h-full w-full cursor-pointer" onClick={handleOnClick}>
        {displayPlayerSymbol()}
      </button>
    </li>
  );
};
