import { ChangeEvent, RefObject, useRef, useState } from "react";
import SoSBoard from "./components/SoSBoard";
import ThreeColumnLayout from "./components/ThreeColumnLayout";
import { GeneralSoSGame, SimpleSoSGame } from "./features/sosGame";
import { ComputerPlayer, Player } from "./features/player";

const BOARD_SIZES = [
  [3, 3],
  [4, 4],
  [5, 5],
  [6, 6],
  [7, 7],
  [8, 8],
];

let bluePlayer = new Player("Blue Player", "S");
let redPlayer = new Player("Red Player", "O");
let sosPlayers = [bluePlayer, redPlayer]

const simpleSoSGame = new SimpleSoSGame(sosPlayers, 3, 3, bluePlayer);
const generalSoSGame = new GeneralSoSGame(sosPlayers, 3, 3, bluePlayer)
let sosGameToRender: SimpleSoSGame | GeneralSoSGame = simpleSoSGame

function App() {
  const [displayedSize, setDisplayedSize] = useState(simpleSoSGame.board.size);
  const [displayedPlayersTurn, setDisplayedPlayersTurn] = useState(simpleSoSGame.getWhoseTurnIsIt().getPlayerName(),);
  const [redPlayerSoSCount, setRedPlayerSoSCount] = useState(redPlayer.sosCount,);
  const [bluePlayerSoSCount, setBluePlayerSoSCount] = useState(redPlayer.sosCount,);
  const [displayWinner, setDisplayedWinner] = useState<undefined | Player>(undefined);
  const [renderGameMode, setRenderedGameMode] = useState<string>("SIMPLE")
  const [renderPlayer, setRenderPlayer] = useState<boolean>(true)
  const cellComponents = useRef<HTMLDivElement>(null)

  const bluePlayerInput = {
    symbolRef: useRef<HTMLFormElement>(null),
    playerTypeRef: useRef<HTMLFormElement>(null),
    symbolInputName: "blue-player-symbol",
    playerTypeInputName: "blue-player-type"
  };

  const redPlayerInput = {
    symbolRef: useRef<HTMLFormElement>(null),
    playerTypeRef: useRef<HTMLFormElement>(null),
    symbolInputName: "red-player-symbol",
    playerTypeInputName: "red-player-type"
  };

  const gameModeInput = useRef<HTMLFormElement>(null);

  const switchDisplayedPlayersTurn = (nextPlayerTurn: Player) => {
    setDisplayedPlayersTurn(nextPlayerTurn.getPlayerName());
  };

  const selectPlayerSymbol = (playerInput: {symbolRef: RefObject<HTMLFormElement | null>; symbolInputName: string;}, player: Player,) => {
    if (playerInput.symbolRef.current) {
      const selectedPlayerSymbol = playerInput.symbolRef.current.querySelector(`input[name="${playerInput.symbolInputName}"]:checked`,) as HTMLInputElement;
      player.setPlayerSymbol(selectedPlayerSymbol.value);
    }
  };

  const selectPlayerType = (playerInput: {playerTypeRef: RefObject<HTMLFormElement | null>; playerTypeInputName: string;}, player: Player) => {
    if (playerInput.playerTypeRef.current) {
      const selectedPlayerType = playerInput.playerTypeRef.current.querySelector(`input[name="${playerInput.playerTypeInputName}"]:checked`,) as HTMLInputElement;

      if (selectedPlayerType.value == "HUMAN") {
        console.log("HUMAN selected")
        player = new Player(player.getPlayerName(), player.getPlayerSymbol())
      } else if(selectedPlayerType.value == "COMPUTER") {
        if(playerInput.playerTypeInputName == bluePlayerInput.playerTypeInputName) {
          bluePlayer = new ComputerPlayer(
            player.getPlayerName(),
            player.getPlayerSymbol(),
            true,
            sosGameToRender,
            cellComponents,
            [setBluePlayerSoSCount, setRedPlayerSoSCount],
            switchDisplayedPlayersTurn,
            setDisplayedWinner
          )

          sosPlayers = [bluePlayer, redPlayer]

          sosGameToRender.setPlayers(sosPlayers)
        } else {
          redPlayer = new ComputerPlayer(
            player.getPlayerName(),
            player.getPlayerSymbol(),
            true,
            sosGameToRender,
            cellComponents,
            [setBluePlayerSoSCount, setRedPlayerSoSCount],
            switchDisplayedPlayersTurn,
            setDisplayedWinner
          )
          
          sosPlayers = [bluePlayer, redPlayer]
          
          sosGameToRender.setPlayers(sosPlayers)
        }
      }

      setTimeout(() => {
        console.log('sosGame from App.tsx')
        console.log(sosGameToRender)
        setRenderPlayer((prevValue) => !prevValue)
      }, 1000)
    }
  }

  const selectBoardSize = (e: ChangeEvent<HTMLSelectElement>) => {
    const boardSize = Number(e.target.value);
    simpleSoSGame.board.setBoardSize(boardSize, boardSize)
    generalSoSGame.board.setBoardSize(boardSize, boardSize)

    setTimeout(() => {setDisplayedSize([boardSize, boardSize])}, 1000)
    
  };

  const selectGameMode = (e: ChangeEvent<HTMLInputElement>) => {
    const setGameMode = e.target.value;

    if (setGameMode == "SIMPLE") {
      sosGameToRender = simpleSoSGame
      setTimeout(() => {setRenderedGameMode("SIMPLE")}, 1000)
    } else if (setGameMode == "GENERAL") {
      sosGameToRender = generalSoSGame
      setTimeout(() => {setRenderedGameMode("GENERAL")}, 1000)
    }
  };

  return (
    <main>
      <ThreeColumnLayout layoutLevel="root" gap="16px">
        <ThreeColumnLayout.LeftColumn columnPercent={25}>
          <p>Blue Player</p>

          <form ref={bluePlayerInput.playerTypeRef}>
            <label><input type="radio" name={bluePlayerInput.playerTypeInputName} onChange={() => {selectPlayerType(bluePlayerInput, bluePlayer);}} value="HUMAN" defaultChecked={true}></input>
              Human
            </label>
            <label><input type="radio" name={bluePlayerInput.playerTypeInputName} onChange={() => { selectPlayerType(bluePlayerInput, bluePlayer);}} value="COMPUTER"></input>
              Computer
            </label>
          </form>

          <p>SoS Count: {bluePlayerSoSCount}</p>
          <form ref={bluePlayerInput.symbolRef}>
            <label><input type="radio" name={bluePlayerInput.symbolInputName} onChange={() => {selectPlayerSymbol(bluePlayerInput, bluePlayer);}} value="S" defaultChecked={true}></input>
              S
            </label>
            <label><input type="radio" name={bluePlayerInput.symbolInputName} onChange={() => { selectPlayerSymbol(bluePlayerInput, bluePlayer);}} value="O"></input>
              O
            </label>
          </form>
        </ThreeColumnLayout.LeftColumn>

        <ThreeColumnLayout.MiddleColumn columnPercent={50}>
          <div className="flex gap-6">
            <form ref={gameModeInput} className="flex gap-3">
              <label>
                <input
                  type="radio"
                  name="game-mode"
                  onChange={selectGameMode}
                  defaultChecked={true}
                  value="SIMPLE"
                ></input>
                Simple Game
              </label>
              <label>
                <input
                  type="radio"
                  name="game-mode"
                  onChange={selectGameMode}
                  value="GENERAL"
                ></input>
                General Game
              </label>
            </form>

            <label htmlFor="board-sizes">Board Size:</label>
            <select id="board-sizes" onChange={selectBoardSize}>
              {BOARD_SIZES.map((size) => {
                const rowCount = size[0];
                const columnCount = size[1];

                return (
                  <option value={rowCount}>
                    {rowCount}x{columnCount}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <span className="hidden">{displayedSize}</span>
            <span>{renderGameMode} </span>
            <span>{renderPlayer == true ? '`' : '*'}</span>
            <SoSBoard
              sosGame={sosGameToRender}
              switchDisplayedPlayersTurn={switchDisplayedPlayersTurn}
              setDisplayedPlayersSoSCount={[
                setBluePlayerSoSCount,
                setRedPlayerSoSCount,
              ]}
              setDisplayedWinner={setDisplayedWinner}
              cellComponents={cellComponents}
            />
          </div>

          <p>Current Turn: {displayedPlayersTurn}</p>
          <p>
            Winner:{" "}
            {displayWinner == undefined ? "none" : displayWinner.getPlayerName()}
          </p>
        </ThreeColumnLayout.MiddleColumn>

        <ThreeColumnLayout.RightColumn columnPercent={25}>
          <p>Red Player</p>

          <form ref={redPlayerInput.playerTypeRef}>
            <label><input type="radio" name={redPlayerInput.playerTypeInputName} onChange={() => {selectPlayerType(redPlayerInput, redPlayer);}} value="HUMAN" defaultChecked={true}></input>
              Human
            </label>
            <label><input type="radio" name={redPlayerInput.playerTypeInputName} onChange={() => { selectPlayerType(redPlayerInput, redPlayer);}} value="COMPUTER"></input>
              Computer
            </label>
          </form>

          <p>SoS Count: {redPlayerSoSCount}</p>
          <form ref={redPlayerInput.symbolRef}>
            <label><input type="radio" name={redPlayerInput.symbolInputName} onChange={() => { selectPlayerSymbol(redPlayerInput, redPlayer)}} value="S" ></input>
              S
            </label>
            <label><input type="radio" name={redPlayerInput.symbolInputName} onChange={() => { selectPlayerSymbol(redPlayerInput, redPlayer)}} value="O" defaultChecked={true} ></input>
              O
            </label>
          </form>
        </ThreeColumnLayout.RightColumn>
      </ThreeColumnLayout>
    </main>
  );
}

export default App;
