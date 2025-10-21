import { SoSGame , gameModes } from "../../src/features/sosGame"

describe("AC 2.1: Default game mode selection", () => {
  it("should initialize default board mode to simple", () => {
    const sosGame = new SoSGame()
    
    expect(sosGame.getGameMode()).to.equal(gameModes.Simple);
  });
});

describe("AC 2.2: Choosing the Simple Game mode", () => {
  it("should change game mode to general", () => {
    const sosGame = new SoSGame()
    
    sosGame.setGameMode(gameModes.General)

    expect(sosGame.getGameMode()).to.equal(gameModes.General);
  });
});