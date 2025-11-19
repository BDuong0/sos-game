import { RefObject, useState } from "react";
import { SoSGame } from "@/features/sosGame";
import { ComputerPlayer, Player } from "@/features/player";
import { ChartNoAxesColumnDecreasing } from "lucide-react";

type SoSBoardProps = {
  sosGame: SoSGame;
  switchDisplayedPlayersTurn: (nextPlayerTurn: Player) => void;
  setDisplayedPlayersSoSCount: React.Dispatch<React.SetStateAction<number>>[]
  setDisplayedWinner: React.Dispatch<React.SetStateAction<Player | undefined>>,
  cellComponents: RefObject<HTMLDivElement | null>
};

const SoSBoard = ({ sosGame, switchDisplayedPlayersTurn, setDisplayedPlayersSoSCount, setDisplayedWinner, cellComponents}: SoSBoardProps) => {
  function showGridCells() {
    return sosGame.board.grid.flatMap((rows, rowIndex) =>
      rows.map((_, columnIndex) => (
        <BoardCell
          sosGame={sosGame}
          rowIndex={rowIndex}
          columnIndex={columnIndex}
          switchDisplayedPlayersTurn={switchDisplayedPlayersTurn}
          setDisplayedPlayersSoSCount = {setDisplayedPlayersSoSCount}
          setDisplayedWinner = {setDisplayedWinner}
          key={`cell-${rowIndex}-${columnIndex}`}
        />
      )),
    );
  }

  return (
    <div
      ref={cellComponents}
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

interface BoardCellProps {
  sosGame: SoSGame;
  rowIndex: number;
  columnIndex: number;
  switchDisplayedPlayersTurn: (nextPlayerTurn: Player) => void;
  setDisplayedPlayersSoSCount: React.Dispatch<React.SetStateAction<number>>[]
  setDisplayedWinner: React.Dispatch<React.SetStateAction<Player | undefined>>
}

const BoardCell = ({
  sosGame,
  rowIndex,
  columnIndex,
  switchDisplayedPlayersTurn,
  setDisplayedPlayersSoSCount,
  setDisplayedWinner
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

  const placeSymbolInCell = (
    rowIndex: number,
    columnIndex: number,
  ) => {
    setDisplayedCellValue(sosGame.getWhoseTurnIsIt().getPlayerSymbol());

    const filledCellIndex = sosGame.makeMove(
      sosGame.getWhoseTurnIsIt(),
      rowIndex,
      columnIndex,
    );

    sosGame.detectSOSMade(filledCellIndex[0], filledCellIndex[1]);
    
    for (let i = 0; i < setDisplayedPlayersSoSCount.length ; i++) {
      setDisplayedPlayersSoSCount[i](sosGame.getPlayers()[i].sosCount)
    }

    sosGame.turnCount += 1

    const winner = sosGame.determineWinner()

    if (winner) {
      setDisplayedWinner(winner)
    }
 
    const nextPlayersTurn = sosGame.decideNextPlayersTurn()
    sosGame.setWhoseTurnIsIt(nextPlayersTurn);
    switchDisplayedPlayersTurn(nextPlayersTurn);
    
    // Computer Player specific code
    if (nextPlayersTurn instanceof ComputerPlayer) {
      nextPlayersTurn.makeMove()
    }
  };

  return (
    <div className="border-2 border-solid border-black" data-cellIndex={`${rowIndex} ${columnIndex}`}>
      <button
        className="h-full w-full cursor-pointer"
        onClick={() => {
          placeSymbolInCell(rowIndex, columnIndex);
        }}
      >
        {displayPlayerSymbol()}
      </button>
    </div>
  );
};
