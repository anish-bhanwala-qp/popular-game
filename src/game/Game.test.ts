import { Color, colors, GameFactory, getConnectedNeighbours } from "./Game";

const { RED: R, GREEN: G, BLUE: B } = Color;

describe("Initializing game", () => {
  describe("Initialize game with given dimension", () => {
    it("should initialize grid with a valid dimension", () => {
      const game = GameFactory.withDimension(10);
      expect(game.gridClone().length).toBe(100);
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
      for (const color of game.gridClone()) {
        expect(colors.find((c) => c === color)).toBeTruthy();
        totalMatches++;
      }

      // This is to ensure all slots were checked
      expect(totalMatches).toBe(25);
    });
  });

  describe("initialize game with already initialized grid", () => {
    it("should throw error if grid rows are less than 2", () => {
      // Only one row
      const invalidGridRows = [R, B];
      expect(() => GameFactory.withGrid(invalidGridRows, 2)).toThrowError(
        "The grid length must be"
      );
    });

    it("should throw error when any row has columns not matching the row count", () => {
      // Intead of 4 tiles (2 x 2 grid) it has only 3 tiles
      const invalidGrid = [R, B, G];
      expect(() => GameFactory.withGrid(invalidGrid, 2)).toThrowError(
        "The grid length must be"
      );
    });

    it("should throw error when any tile has invalid color", () => {
      const invalidGrid = [R, B, G, "invalid color"] as any;
      expect(() => GameFactory.withGrid(invalidGrid, 2)).toThrowError(
        "Invalid color"
      );
    });
  });
});

describe("getConnectedNeighbours for a 4 x 4 grid", () => {
  /* 
    NOTE: order of returned indexes is top, right, bottom, left
    
    Reference indexes for a 4 x 4 grid    
        0 , 1 , 2 , 3 ,
        4 , 5 , 6 , 7 ,
        8 , 9 , 10, 11,
        12, 13, 14, 15    
  */
  const DIMENSION = 4;
  it("should return correct neighbours for TOP-LEFT tile", () => {
    const neighbourIndexes = getConnectedNeighbours(0, DIMENSION);
    expect(neighbourIndexes).toEqual([1, 4]);
  });
  it("should return correct neighbours for BOTTOM-LEFT tile", () => {
    const neighbourIndexes = getConnectedNeighbours(12, DIMENSION);
    expect(neighbourIndexes).toEqual([8, 13]);
  });
  it("should return correct neighbours for BOTTOM-RIGHT tile", () => {
    const neighbourIndexes = getConnectedNeighbours(15, DIMENSION);
    expect(neighbourIndexes).toEqual([11, 14]);
  });
  it("should return correct neighbours for TOP-RIGHT tile", () => {
    const neighbourIndexes = getConnectedNeighbours(3, DIMENSION);
    expect(neighbourIndexes).toEqual([7, 2]);
  });
  it("should return correct neighbours for the middle (6) tile", () => {
    const neighbourIndexes = getConnectedNeighbours(6, DIMENSION);
    expect(neighbourIndexes).toEqual([2, 7, 10, 5]);
  });
});

describe("Making moves", () => {
  describe("Game over detection", () => {
    it("should return false when game is not over (all tiles are not of same color) yet after a move", () => {
      // prettier-ignore
      const input = [
        R, G, G, B,
        R, R, R, G,
        R, B, G, R,
        R, R, G, G
    ];

      const game = GameFactory.withGrid(input, 4);
      game.move(B);
      expect(game.isGameOver()).toBeFalsy();
    });

    it("should return true when game is over (all tiles are of same color)", () => {
      // prettier-ignore
      const input = [
        R, R, R, B,
        R, R, R, R,
        R, B, R, R,
        R, R, R, R
    ];

      const game = GameFactory.withGrid(input, 4);
      game.move(B);

      expect(game.isGameOver()).toBeTruthy();
    });

    it("should ignore move when game is already over", () => {
      // prettier-ignore
      const input = [
          R, R, R, B,
          R, R, R, R,
          R, B, R, R,
          R, R, R, R
      ];

      const game = GameFactory.withGrid(input, 4);
      game.move(B);
      expect(game.isGameOver()).toBeTruthy();
      const moveCount = game.moveCount();

      game.move(R);
      expect(game.moveCount()).toBe(moveCount);
    });
  });

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

  it("should not increment the move count when trying to make move without color change", () => {
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

  it("should not change color for diagonal neighbours", () => {
    // The bottom row has two Red tiles that are diagonally connected
    // prettier-ignore
    const input = [
        R, R, G, G,
        R, R, G, G,
        G, R, G, G,
        R, G, R, G
    ];
    // prettier-ignore
    const expected = [
        B, B, G, G,
        B, B, G, G,
        G, B, G, G,
        R, G, R, G
    ];

    const game = GameFactory.withGrid(input, 4);
    game.move(B);

    expect(game.gridClone()).toEqual(expected);
  });
});
