import { SoSGame } from "../../src/features/sosGame"

describe("AC 3.1: Start the game on the blue player’s turn", () => {
  it("should initialize the current turn to be the blue player's turn (blue player = 1)", () => {
    const sosGame = new SoSGame()
    
    expect(sosGame.getWhoseTurn()).to.equal(1);
  });
});