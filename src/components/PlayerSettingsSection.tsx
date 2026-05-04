import RadioButton from "@/components/ui/RadioButton";
import { Player } from "@/features/player";
import { RefObject } from "react";

type PlayerSettingsSectionProps = {
  player: Player;
  symbolRef: RefObject<HTMLFormElement | null>;
  playerTypeRef: RefObject<HTMLFormElement | null>;
  symbolInputName: string;
  playerTypeInputName: string;
  selectPlayerType: (playerInput: {
    playerTypeRef: RefObject<HTMLFormElement | null>;
    playerTypeInputName: string;
  }, player: Player) => void;
  selectPlayerSymbol: (playerInput: {
      symbolRef: RefObject<HTMLFormElement | null>;
      symbolInputName: string;
  }, player: Player) => void;
  displayedSoSCount: number
};

const PlayerSettingsSection = ({
  player, 
  symbolRef, 
  playerTypeRef, 
  symbolInputName, 
  playerTypeInputName, 
  selectPlayerType, 
  selectPlayerSymbol, 
  displayedSoSCount}: PlayerSettingsSectionProps) => {
  return (
    <div className="w-3/4">
      <Header player={player} displayedSoSCount={displayedSoSCount}/>
      
      <h4>Player Type:</h4>
      <form ref={playerTypeRef} className="flex gap-2">
        <RadioButton name={playerTypeInputName} value="HUMAN" onChange={() => {selectPlayerType({playerTypeRef, playerTypeInputName}, player);}}>
          Human
        </RadioButton>
        <RadioButton name={playerTypeInputName} value="COMPUTER" onChange={() => {selectPlayerType({playerTypeRef, playerTypeInputName}, player);}}>
          Computer
        </RadioButton>
      </form>

      <h4>Player Symbol:</h4>
      <form ref={symbolRef} className="flex gap-2">
        <RadioButton name={symbolInputName} value="S" onChange={() => {selectPlayerSymbol({symbolRef, symbolInputName}, player);}}>
          S
        </RadioButton>
        
        <RadioButton name={symbolInputName} value="O" onChange={() => {selectPlayerSymbol({symbolRef, symbolInputName}, player);}}>
          O
        </RadioButton>
      </form>
    </div>
  );
};

export default PlayerSettingsSection;

const Header = ({player, displayedSoSCount} : {player: Player, displayedSoSCount: number}) => {
  return (
    <div className="flex gap-3">
      <h3 className={`${player.playerColor == "blue" ? "mt-0 text-blue-500" : "mt-0 text-red-500 order-2"}`}>
        {player.getPlayerName()}
      </h3>

      <div className={`${player.playerColor == "blue" ? "bg-blue-500 rounded-sm h-fit text-center" : "bg-red-500 rounded-sm h-fit text-center order-1"}`}>
        <p className="mb-1 mx-1">Score</p>
        <span>{displayedSoSCount}</span>
      </div>
    </div>
  )
}

