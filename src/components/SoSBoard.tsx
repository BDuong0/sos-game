import { useState } from "react";
import { SoSGame } from "@/features/sosGame";
import { Player } from "@/features/player";

type SoSBoardProps = {
  sosGame: SoSGame;
  switchDisplayedPlayersTurn: (nextPlayerTurn: Player) => void;
};

const SoSBoard = ({ sosGame, switchDisplayedPlayersTurn }: SoSBoardProps) => {
  function showGridCells() {
    return sosGame.board.grid.map((rows, rowIndex) => (
      <li key={rowIndex}>
        <ul>
          {rows.map((columns, colIndex) => (
            <BoardCell
              sosGame={sosGame}
              rowIndex={rowIndex}
              columnIndex={colIndex}
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
  columnIndex: number;
  switchDisplayedPlayersTurn: (nextPlayerTurn: Player) => void;
};

const BoardCell = ({
  sosGame,
  rowIndex,
  columnIndex,
  switchDisplayedPlayersTurn,
}: BoardCellProps) => {
  const [displayedCellValue, setDisplayedCellValue] = useState(
    // sosGame.board.grid[rowIndex][columnIndex] = [string, any]
    sosGame.board.grid[rowIndex][columnIndex][0],
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

  const placeSymbolInCell = (rowIndex: number, columnIndex: number, nextPlayersTurn: Player) => {
    const currentPlayersTurn = sosGame.getWhoseTurnIsIt();
    sosGame.placeSymbolInEmptyCell(rowIndex, columnIndex);

    setDisplayedCellValue(currentPlayersTurn.getPlayerSymbol());

    sosGame.setWhoseTurnIsIt(nextPlayersTurn);
    switchDisplayedPlayersTurn(nextPlayersTurn);
  };

  const decideNextPlayersTurn = () => {
    const currentPlayersTurn = sosGame.getWhoseTurnIsIt();
    const [bluePlayer, redPlayer] = sosGame.getPlayers();

    if (currentPlayersTurn == redPlayer) {
      return bluePlayer;
    } else {
      return redPlayer;
    }
  };

  return (
    <li key={columnIndex} className="border-2 border-solid border-black">
      <button
        className="h-full w-full cursor-pointer"
        onClick={() => {
          placeSymbolInCell(rowIndex, columnIndex, decideNextPlayersTurn());
        }}
      >
        {displayPlayerSymbol()}
      </button>
    </li>
  );
};
