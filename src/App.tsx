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

let simpleSoSGame = new SimpleSoSGame(sosPlayers, 3, 3, bluePlayer);
let generalSoSGame = new GeneralSoSGame(sosPlayers, 3, 3, bluePlayer)
let sosGameToRender: SimpleSoSGame | GeneralSoSGame = simpleSoSGame

let recordedSoSGame = null

function App() {
  const [displayedBoardSize, setDisplayedBoardSize] = useState(simpleSoSGame.board.size);
  const [displayedPlayersTurn, setDisplayedPlayersTurn] = useState(simpleSoSGame.getWhoseTurnIsIt().getPlayerName(),);
  const [displayedWinner, setDisplayedWinner] = useState<undefined | Player>(undefined);
  const [displayedGameMode, setDisplayedGameMode] = useState<"SIMPLE" | "GENERAL">("SIMPLE")
  const [displayedRedPlayerSoSCount, setDisplayedRedPlayerSoSCount] = useState(redPlayer.sosCount,);
  const [displayedBluePlayerSoSCount, setDisplayedBluePlayerSoSCount] = useState(redPlayer.sosCount,);
  const [renderSoSBoard, setRenderSoSBoard] = useState<boolean>(true)
  const cellComponents = useRef<HTMLDivElement>(null)
  // Create ref for id="board-sizes", in createNewGame, set the ref.current selected to 3x3
  const boardSizeDropdown = useRef<HTMLSelectElement>(null);
  const gameModeInput = useRef<HTMLFormElement>(null);

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
            [setDisplayedBluePlayerSoSCount, setDisplayedRedPlayerSoSCount],
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
            [setDisplayedBluePlayerSoSCount, setDisplayedRedPlayerSoSCount],
            switchDisplayedPlayersTurn,
            setDisplayedWinner
          )
          
          sosPlayers = [bluePlayer, redPlayer]
          
          sosGameToRender.setPlayers(sosPlayers)
        }
      }
    }
  }

  const selectBoardSize = (e: ChangeEvent<HTMLSelectElement>) => {
    const boardSize = Number(e.target.value);
    simpleSoSGame.board.setBoardSize(boardSize, boardSize)
    generalSoSGame.board.setBoardSize(boardSize, boardSize)

    setTimeout(() => {setDisplayedBoardSize([boardSize, boardSize])}, 1000)
    
  };

  const selectGameMode = (e: ChangeEvent<HTMLInputElement>) => {
    const setGameMode = e.target.value;

    if (setGameMode == "SIMPLE") {
      sosGameToRender = simpleSoSGame
      setTimeout(() => {setDisplayedGameMode("SIMPLE")}, 1000)
    } else if (setGameMode == "GENERAL") {
      sosGameToRender = generalSoSGame
      setTimeout(() => {setDisplayedGameMode("GENERAL")}, 1000)
    }
  };

  const createNewGame = () => {
    bluePlayer = new Player("Blue Player", "S")
    redPlayer = new Player("Red Player", "O");
    sosPlayers = [bluePlayer, redPlayer]
    simpleSoSGame = new SimpleSoSGame(sosPlayers, 3, 3, bluePlayer);
    generalSoSGame = new GeneralSoSGame(sosPlayers, 3, 3, bluePlayer)
    sosGameToRender = simpleSoSGame

    // Reset UI radio buttons and dropdowns
    const bluePlayerSRadioButton = bluePlayerInput.symbolRef.current?.querySelector(`input[value="S"]`) as HTMLInputElement;
    if (bluePlayerSRadioButton.checked != true) bluePlayerSRadioButton.checked = true
    const bluePlayerHumanRadioButton = bluePlayerInput.playerTypeRef.current?.querySelector(`input[value="HUMAN"]`) as HTMLInputElement;
    if (bluePlayerHumanRadioButton.checked != true) bluePlayerHumanRadioButton.checked = true
    setDisplayedRedPlayerSoSCount(bluePlayer.sosCount)

    const redPlayerORadioButton = redPlayerInput.symbolRef.current?.querySelector(`input[value="O"]`) as HTMLInputElement;
    if (redPlayerORadioButton.checked != true) redPlayerORadioButton.checked = true
    const redPlayerHumanRadioButton = redPlayerInput.playerTypeRef.current?.querySelector(`input[value="HUMAN"]`) as HTMLInputElement;
    if (redPlayerHumanRadioButton.checked != true) redPlayerHumanRadioButton.checked = true
    setDisplayedRedPlayerSoSCount(redPlayer.sosCount)

    if (boardSizeDropdown.current && boardSizeDropdown.current.value != "3") boardSizeDropdown.current.value = "3"

    const simpleGameModeButton = gameModeInput.current?.querySelector(`input[value="SIMPLE"]`) as HTMLInputElement;
    if (simpleGameModeButton.checked != true) simpleGameModeButton.checked = true

    setDisplayedBoardSize([3, 3])
    setDisplayedGameMode("SIMPLE")
    setDisplayedPlayersTurn(sosGameToRender.getWhoseTurnIsIt().getPlayerName())

    // 'Rerender' SoSBoard by manually unmounting and remounting <SoSBoard/>
    setTimeout(() => {setRenderSoSBoard((prevValue) => !prevValue)}, 10)
    setTimeout(() => {setRenderSoSBoard((prevValue) => !prevValue)}, 100)
  }

  const toggleRecordGame = (e: ChangeEvent<HTMLInputElement>) => {
    const checkboxValue: boolean = e.target.checked
    
    if (checkboxValue == true) {
      recordedSoSGame = "Should be instance of RecordedSoSGame"
      console.log(`recordedSoSGame = ${recordedSoSGame}`)
    } else if(checkboxValue == false) {
      recordedSoSGame = null
      console.log(`recordedSoSGame = ${recordedSoSGame}`)
    }
  }

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

          <p>SoS Count: {displayedBluePlayerSoSCount}</p>
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
                <input type="radio" name="game-mode" onChange={selectGameMode} defaultChecked={true} value="SIMPLE"></input>
                Simple Game
              </label>
              <label>
                <input type="radio" name="game-mode" onChange={selectGameMode} value="GENERAL"
                ></input>
                General Game
              </label>
            </form>

            <label htmlFor="board-sizes">Board Size:</label>
            <select ref={boardSizeDropdown} id="board-sizes" onChange={selectBoardSize}>
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
            <span className="hidden">{displayedBoardSize}</span>
            <span>{displayedGameMode} </span>
            <span>{renderSoSBoard == true ? '`' : '*'}</span>
            <div>
              {renderSoSBoard == true && 
                <SoSBoard
                  sosGame={sosGameToRender}
                  switchDisplayedPlayersTurn={switchDisplayedPlayersTurn}
                  setDisplayedPlayersSoSCount={[
                    setDisplayedBluePlayerSoSCount,
                    setDisplayedRedPlayerSoSCount,
                  ]}
                  setDisplayedWinner={setDisplayedWinner}
                  cellComponents={cellComponents}
                />
              }
            </div>
          </div>

          <p>Current Turn: {displayedPlayersTurn}</p>
          <p>
            Winner:{" "}
            {displayedWinner == undefined ? "none" : displayedWinner.getPlayerName()}
          </p>
          <button className="border-2 cursor-pointer hover:bg-neutral-200" onClick={createNewGame}>New Game</button>
          <label className="block"><input type="checkbox" name="record-game" onChange={toggleRecordGame}></input>Record game</label>
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

          <p>SoS Count: {displayedRedPlayerSoSCount}</p>
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
