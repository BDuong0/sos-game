import { ChangeEvent, RefObject, useRef, useState } from "react";
import SoSBoard from "./components/SoSBoard";
import ThreeColumnLayout from "./components/ThreeColumnLayout";
import { GeneralSoSGame, SimpleSoSGame } from "./features/sosGame";
import { ComputerPlayer, Player } from "./features/player";
import { RecordedSoSGame } from "./features/recordedSoSGame";
import { SoSGameReplayer } from "./features/sosGameReplayer";
import PlayerSettingsSection from "@/components/PlayerSettingsSection";
import RadioButton from "@/components/ui/RadioButton";
import Checkbox from "@/components/ui/Checkbox";
import Tooltip from "@/components/ui/Tooltip";

const BOARD_SIZES = [
  [3, 3],
  [4, 4],
  [5, 5],
  [6, 6],
  [7, 7],
  [8, 8],
];

let bluePlayer = new Player("Blue Player", "S", "blue");
let redPlayer = new Player("Red Player", "O", "red");
let sosPlayers = [bluePlayer, redPlayer]

let simpleSoSGame = new SimpleSoSGame(sosPlayers, 3, 3, bluePlayer);
let generalSoSGame = new GeneralSoSGame(sosPlayers, 3, 3, bluePlayer)
let sosGameToRender: SimpleSoSGame | GeneralSoSGame = simpleSoSGame

let recordedSoSGame: RecordedSoSGame | null = null
let sosGameReplayer: SoSGameReplayer | null = null

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
  const recordGameCheckbox = useRef<HTMLInputElement>(null)

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
        player = new Player(player.getPlayerName(), player.getPlayerSymbol(), player.playerColor)
      } else if(selectedPlayerType.value == "COMPUTER") {
        if(playerInput.playerTypeInputName == bluePlayerInput.playerTypeInputName) {
          bluePlayer = new ComputerPlayer(
            player.getPlayerName(),
            player.getPlayerSymbol(),
            player.playerColor,
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
            player.playerColor,
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
    bluePlayer = new Player("Blue Player", "S", "blue")
    redPlayer = new Player("Red Player", "O", "red");
    sosPlayers = [bluePlayer, redPlayer]
    simpleSoSGame = new SimpleSoSGame(sosPlayers, 3, 3, bluePlayer);
    generalSoSGame = new GeneralSoSGame(sosPlayers, 3, 3, bluePlayer)
    sosGameToRender = simpleSoSGame

    // Reset UI radio buttons and dropdowns
    const bluePlayerSRadioButton = bluePlayerInput.symbolRef.current?.querySelector(`input[value="S"]`) as HTMLInputElement;
    if (bluePlayerSRadioButton.checked != true) bluePlayerSRadioButton.checked = true
    const bluePlayerHumanRadioButton = bluePlayerInput.playerTypeRef.current?.querySelector(`input[value="HUMAN"]`) as HTMLInputElement;
    if (bluePlayerHumanRadioButton.checked != true) bluePlayerHumanRadioButton.checked = true
    setDisplayedBluePlayerSoSCount(bluePlayer.sosCount)

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
      recordedSoSGame = new RecordedSoSGame(sosGameToRender)
      console.log(`recordedSoSGame = ${recordedSoSGame}`)
    } else if(checkboxValue == false) {
      recordedSoSGame = null
      console.log(`recordedSoSGame = ${recordedSoSGame}`)
    }
  }

  const replayFromTextFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      sosGameReplayer = new SoSGameReplayer(
        e.target.files[0], 
        sosGameToRender, 
        sosPlayers,
        cellComponents,
        [setDisplayedBluePlayerSoSCount, setDisplayedRedPlayerSoSCount],
        switchDisplayedPlayersTurn,
        setDisplayedWinner,
        setDisplayedBoardSize,
        setDisplayedGameMode,
        [setDisplayedBluePlayerSoSCount, setDisplayedRedPlayerSoSCount]
      )
      
      setTimeout(() => {
        console.log("Post replayFromTextFile")

        if (sosGameReplayer?.getSoSGameToRender()) {
          sosGameToRender = sosGameReplayer.getSoSGameToRender()
        }

        console.log(sosGameToRender)
        if (sosGameToRender instanceof SimpleSoSGame) {console.log("Should be SoS")}
        if (sosGameToRender instanceof GeneralSoSGame) {console.log("GeneralSoSGame")}

        if (sosGameReplayer) {
          sosGameReplayer.replayMoves()
        }
      }, 1000)
    }
  }

  const rightAndLeftColumnStyles = "grid place-items-center"
  return (
    <main>
      <ThreeColumnLayout layoutLevel="root" gap="12px" className="h-screen">
        <ThreeColumnLayout.LeftColumn columnPercent={25} className={rightAndLeftColumnStyles}>
          <PlayerSettingsSection
            player={bluePlayer} 
            symbolRef={bluePlayerInput.symbolRef}
            playerTypeRef={bluePlayerInput.playerTypeRef}
            symbolInputName={bluePlayerInput.symbolInputName}
            playerTypeInputName={bluePlayerInput.playerTypeInputName}
            selectPlayerType={selectPlayerType}
            selectPlayerSymbol={selectPlayerSymbol}
            displayedSoSCount={displayedBluePlayerSoSCount}>
          </PlayerSettingsSection>
        </ThreeColumnLayout.LeftColumn>

        <ThreeColumnLayout.MiddleColumn columnPercent={40} className="grid place-items-center">
          <div className="w-11/12">
            <div className="text-center">
              <h1 className="mt-0">SOS game</h1>
              <p>A variant of the Tic Tac Toe game. Hover, over the game mode next to "Current Game Mode" for a brief explaination of the SOS game</p>
            </div>
            <h4>Game Settings:</h4>
            <div className="flex gap-6">
              <form ref={gameModeInput} className="flex gap-3">
                <RadioButton name="game-mode" defaultChecked={true} value="SIMPLE" onChange={selectGameMode} >
                  Simple Game
                </RadioButton>
                <RadioButton name="game-mode" value="GENERAL" onChange={selectGameMode}>
                  General Game
                </RadioButton>
              </form>

              <div className="flex flex-col">
                <label htmlFor="board-sizes">Board Size:</label>
                <select 
                  ref={boardSizeDropdown} 
                  id="board-sizes" 
                  onChange={selectBoardSize}
                  className="rounded-sm border-1 cursor-pointer px-1"
                >
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
              <button className="border-2" onClick={createNewGame}>
                New Game
              </button>
            </div>

            <div>
              <span className="hidden">{displayedBoardSize}</span>
              <span className="hidden">{renderSoSBoard == true ? '`' : '*'}</span>
              <p className="w-full mt-3 text-center">Current Game Mode: {
              displayedGameMode == "SIMPLE" ? 
              <Tooltip text="Each player takes turns placing either an 'S' or an 'O' and the first player that makes an SOS on the board wins the game.">
                Simple
              </Tooltip> :
              <Tooltip text="Each player takes turns placing either an 'S' or an 'O' until the entire board is filled. The player who made more SOS's, indicated by the player with higher score, wins the game.">
                General
              </Tooltip>
              } </p>
              
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
            
            <div className="flex justify-around mt-[var(--rhythm-unit)]">
              <p 
                className={`${sosGameToRender.getWhoseTurnIsIt().playerColor == "blue" ? "text-blue-500" : "text-red-500"}`}>
                Current Turn: {displayedPlayersTurn}
              </p>
              <p>
                <span className={displayedWinner == undefined ? "" : "text-green-500"}>
                  Winner:{" "}
                </span>
                {displayedWinner == undefined ? "None" : (() => { // This unfamiliar syntax is Javascript immediately invoked function expression (IIFE)
                  if (recordedSoSGame instanceof RecordedSoSGame) { // If 'Record Game' checkbox is checked
                    recordedSoSGame.downloadTextFile()
                    recordedSoSGame = null

                    if (recordGameCheckbox.current) {recordGameCheckbox.current.checked = false}
                  }

                  if (displayedWinner.getPlayerName() == "Blue Player") {
                    return (<span className="text-blue-500">{displayedWinner.getPlayerName()}</span>)
                  } else {
                    return (<span className="text-red-500">{displayedWinner.getPlayerName()}</span>)
                  }
                })()}
              </p>
            </div>
            
            <div className="flex gap-6 mb-6">
              <div>
                <h4>Record Game</h4>
                <Checkbox name="record-game" ref={recordGameCheckbox} onChange={toggleRecordGame}>
                  Record Game
                </Checkbox>
              </div>
              <div>
                <h4>Replay Game</h4>
                <label htmlFor="replay-game" className="border-2 cursor-pointer hover:bg-[#404040]">Replay game from file</label>
                <input id="replay-game" className="w-fit" type="file" accept=".txt" name="replay-game" onChange={replayFromTextFile}></input>
              </div>
            </div>
          </div>
        </ThreeColumnLayout.MiddleColumn>

        <ThreeColumnLayout.RightColumn columnPercent={25} className={rightAndLeftColumnStyles}>
          <PlayerSettingsSection
            player={redPlayer} 
            symbolRef={redPlayerInput.symbolRef}
            playerTypeRef={redPlayerInput.playerTypeRef}
            symbolInputName={redPlayerInput.symbolInputName}
            playerTypeInputName={redPlayerInput.playerTypeInputName}
            selectPlayerType={selectPlayerType}
            selectPlayerSymbol={selectPlayerSymbol}
            displayedSoSCount={displayedRedPlayerSoSCount}>
          </PlayerSettingsSection>
        </ThreeColumnLayout.RightColumn>
      </ThreeColumnLayout>
    </main>
  );
}

export default App;
