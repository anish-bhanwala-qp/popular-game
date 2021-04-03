import { Color, GameFactory } from "./Game";

const { RED: R, GREEN: G, BLUE: B } = Color;

/* describe("Initializing game", () => {
  describe("Initialize game with given dimension", () => {
    it("should initialize grid with a valid dimension", () => {
      const game = GameFactory.withDimension(10);
      expect(game.gridSize()).toBe(100);
    });

    it("should throw error if dimension is less than 2", () => {
      expect(() => GameFactory.withDimension(1)).toThrowError(
        "The game dimension must be"
      );
    });

    it("should throw error if dimension is greater than 10", () => {
      expect(() => GameFactory.withDimension(11)).toThrowError(
        "The game dimension must be"
      );
    });

    it("should throw error if dimensions is not an integer value", () => {
      expect(() => GameFactory.withDimension(3.1)).toThrowError(
        "The game dimension must be"
      );
    });

    it("should initialize each tile with one of three colors 'red', 'green', 'blue' ", () => {
      const game = GameFactory.withDimension(5);

      let totalMatches = 0;
      for (const value of game) {
        expect(value.color).toMatch(/r|g|b/g);
        totalMatches++;
      }

      // This is to ensure iterator actually ran
      expect(totalMatches).toBe(25);
    });
  });

  describe("initialize game with already initialized grid", () => {
    it("should throw error if grid rows are less than 2", () => {
      // Only one row
      const invalidGridRows = [[R, B]];
      expect(() => GameFactory.withGrid(invalidGridRows)).toThrowError(
        "The grid dimension must be an integer between"
      );
    });

    it("should throw error when any row has columns not matching the row count", () => {
      // Intead of 4 tiles (2 x 2 grid) it has only 3 tiles
      const invalidGrid = [[R, B], [G]];
      expect(() => GameFactory.withGrid(invalidGrid)).toThrowError(
        "The grid is invalid. The column count should be"
      );
    });

    it("should throw error when any tile has invalid color", () => {
      const invalidGrid = [
        [R, B],
        [G, "invalid color"],
      ] as any;
      expect(() => GameFactory.withGrid(invalidGrid)).toThrowError(
        "Invalid color"
      );
    });
  });
}); */

describe("Change Origin color", () => {
  it("should increment the move count for valid move", () => {
    // prettier-ignore
    const input = [
        R, G, G, B,
        R, R, R, G,
        R, B, G, R,
        R, R, G, G
    ];

    const game = GameFactory.withGrid(input, 4);
    game.move(B);
    expect(game.moveCount()).toBe(1);
    game.move(R);
    expect(game.moveCount()).toBe(2);
  });

  it("should not increment th move count when trying to make move without color change", () => {
    // prettier-ignore
    const input = [
        R, G, G, B,
        R, R, R, G,
        R, B, G, R,
        R, R, G, G
    ];

    const game = GameFactory.withGrid(input, 4);
    // color is same as origin
    game.move(R);
    expect(game.moveCount()).toBe(0);
  });

  it("should change color of only connected tiles", () => {
    // prettier-ignore
    const input = [
        R, G, G, B,
        R, R, R, G,
        R, B, G, R,
        R, R, G, G
    ];

    /*  
      There are 7 connected R (red) tiles
      So changing origin to B (blue) should result in:
      7 (new) + 2 (old) = 9 B 
    */
    // prettier-ignore
    const expected = [
        B, G, G, B,
        B, B, B, G,
        B, B, G, R,
        B, B, G, G
    ];

    const game = GameFactory.withGrid(input, 4);
    game.move(B);

    expect(game.gridClone()).toEqual(expected);
  });

  it("should not make any changes if new color is same as origin", () => {
    // prettier-ignore
    const expected = [
        R, G, G, B,
        R, R, R, G,
        R, B, G, R,
        R, R, G, G
    ];

    const game = GameFactory.withGrid(expected, 4);
    game.move(R);

    expect(game.gridClone()).toEqual(expected);
  });
});
