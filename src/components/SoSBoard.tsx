import { useState } from "react";
import { Board } from "../features/board";

const SoSBoard = ({ sosBoard }: { sosBoard: Board }) => {
  function showGridCells() {
    return sosBoard.grid.map((rows, rowIndex) => (
      <li key={rowIndex}>
        <ul>
          {rows.map((columns, colIndex) => (
            <BoardCell
              sosBoard={sosBoard}
              rowIndex={rowIndex}
              colIndex={colIndex}
            />
          ))}
        </ul>
      </li>
    ));
  }

  console.log(sosBoard.size[1]);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${sosBoard.size[1]}, minmax(0, 1fr))`,
      }}
    >
      {showGridCells()}
    </div>
  );
};

export default SoSBoard;

type BoardCellProps = { sosBoard: Board; rowIndex: number; colIndex: number };

const BoardCell = ({ sosBoard, rowIndex, colIndex }: BoardCellProps) => {
  const [cellValue, setCellValue] = useState(sosBoard.grid[rowIndex][colIndex]);

  const handleOnclick = () => {
    console.log(`Cell index = [${rowIndex}][${colIndex}]`);
  };

  return (
    <li key={colIndex} className="border-2 border-solid border-black">
      <button className="h-full w-full cursor-pointer" onClick={handleOnclick}>
        {cellValue}
      </button>
    </li>
  );
};
