import { Board } from "../../src/features/board"

describe("AC 1.1: Default Board Size Selection", () => {
  it("should initialize default board size to 3x3", () => {
    const board = new Board()
    
    expect(board.size.toString()).to.equal([3,3].toString());
  });

  it("should set board size to 3x3 (minimum board size)", () => {
    const board = new Board(3, 3)

    expect(board.size.toString()).to.equal([3,3].toString());
  })

  it("should set board size to 6x6 (between min and max board size)", () => {
    const board = new Board(6, 6)

    expect(board.size.toString()).to.equal([6,6].toString());
  })

  it("should set board size to 8x8 (maximum board size)", () => {
    const board = new Board(8, 8)

    expect(board.size.toString()).to.equal([8,8].toString());
  })

  it("should set board size to 3x3 when board size input is not in valid range", () => {
    const board = new Board(12, 12)

    expect(board.size.toString()).to.equal([3,3].toString());
  })

  it("should set board size to 3x3 when rows and columns input is not uniform", () => {
    const board = new Board(3, 4)

    expect(board.size.toString()).to.equal([3,3].toString());
  })
});