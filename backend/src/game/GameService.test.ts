import { GameService } from "./GameService";
import { findNonOriginColorId } from "../testUtil";

describe("GameService", () => {
  it("should start game id from 1", () => {
    const gameService = new GameService();
    const { id } = gameService.start();
    expect(id).toBe(1);
  });
  it("should increment the game id sequentially whenever a new game is started", () => {
    const gameService = new GameService();
    const game1 = gameService.start();
    expect(game1.id).toBe(1);
    const game2 = gameService.start();
    expect(game2.id).toBe(2);
  });

  it("should throw ValidationError if game id is invalid", () => {
    const gameService = new GameService();
    expect(() => gameService.nextMove(-1, "b")).toThrow(
      "No game found for given game id"
    );
  });

  it("should throw ValidationError if color is invalid", () => {
    const gameService = new GameService();
    const { id } = gameService.start();
    expect(() => gameService.nextMove(id, "invalid-color")).toThrow(
      "Please select a valid color"
    );
  });

  it("should return grid with 100 length for dimension 10 when game is started", async () => {
    const gameService = new GameService();
    const { grid } = gameService.start();
    expect(grid).toHaveLength(100);
  });

  it("should start with empty move history", async () => {
    const gameService = new GameService();
    const { moveHistory } = gameService.start();
    expect(moveHistory).toHaveLength(0);
  });

  it("should add the color to the moveHistory", async () => {
    const gameService = new GameService();
    const { id, grid } = gameService.start();

    // Pick color that's not origin, otherwise the move is ignored.
    const move1ColorId = findNonOriginColorId(grid);
    const move1 = gameService.nextMove(id, move1ColorId);
    expect(move1.moveHistory).toEqual([move1ColorId]);

    // Pick color that's not origin, otherwise the move is ignored.
    const move2ColorId = findNonOriginColorId(move1.grid);
    const move2 = gameService.nextMove(id, move2ColorId);
    expect(move2.moveHistory).toEqual([move1ColorId, move2ColorId]);
  });

  it("should make the ai player move along with real player move", async () => {
    const gameService = new GameService();
    const { id, grid } = gameService.start();
    const nonOriginColorId = findNonOriginColorId(grid);
    const { moveHistory, aiMoveHistory } = gameService.nextMove(
      id,
      nonOriginColorId
    );

    expect(moveHistory).toHaveLength(1);
    expect(aiMoveHistory).toHaveLength(1);
  });

  it("should allow two games to be played at the same time", () => {
    const gameService = new GameService();
    const game1 = gameService.start();
    const game2 = gameService.start();

    // Pick color that's not origin, otherwise the move is ignored.
    const game1ColorId = findNonOriginColorId(game1.grid);
    const game1Move1 = gameService.nextMove(game1.id, game1ColorId);
    expect(game1Move1.moveHistory).toEqual([game1ColorId]);

    // Pick color that's not origin, otherwise the move is ignored.
    const game2ColorId = findNonOriginColorId(game2.grid);
    const game2Move1 = gameService.nextMove(game2.id, game2ColorId);
    expect(game2Move1.moveHistory).toEqual([game2ColorId]);
  });

  it("should remove games that have been completed", () => {
    const gameService = new GameService();
    gameService.start();
    gameService.start();
    const game = gameService.start();
    let latestGrid = game.grid;

    expect(gameService.gameCount()).toBe(3);

    // Run a loop to make moves until the game is over
    let maxLoopCount = 1000;
    while (maxLoopCount-- > 0) {
      const nonOriginColorId = findNonOriginColorId(latestGrid);
      let newGameState = gameService.nextMove(game.id, nonOriginColorId);
      latestGrid = newGameState.grid;
      if (newGameState.isGameOver) {
        break;
      }
    }

    expect(gameService.gameCount()).toBe(2);
  });

  it("should maintain a fixed length list of games specificed by GameConfig.gamesLimit()", () => {
    const gameService = new GameService();

    // Let's add 20 games
    for (let i = 0; i < 20; i++) {
      gameService.start();
    }

    // But the game count should remain fixed
    expect(gameService.gameCount()).toBe(10);
  });
});
