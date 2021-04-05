import { AiPlayer } from "./AiPlayer";
import { GameFactory, IGame } from "./Game";
import { ColorId, GameConfig } from "./GameConfig";
import { ValidationError } from "../ValidationError";

const DIMENSION = GameConfig.getDimension();
const COLORS = GameConfig.getColors();
const GAMES_LIMIT = GameConfig.gamesLimit();

interface GameState {
  id: number;
  realPlayerGame: IGame;
  aiPlayerGame: IGame;
}

function convertToGameDto(gameState: GameState) {
  const { id, realPlayerGame, aiPlayerGame } = gameState;
  return {
    id: id,
    grid: realPlayerGame.getGrid(),
    dimension: realPlayerGame.getDimension(),
    isGameOver: realPlayerGame.isGameOver(),
    colors: COLORS,
    moveHistory: realPlayerGame.getMoves(),
    aiMoveHistory: aiPlayerGame.getMoves(),
  };
}

export class GameService {
  private gameId: number = 1;
  private games: Array<GameState> = [];

  start() {
    // Limit the games array length. For now the logic is simply
    // to remove old game (game started first).
    if (this.games.length === GAMES_LIMIT) {
      this.games.shift();
    }

    const realPlayerGame = GameFactory.withDimension(DIMENSION);
    const aiPlayerGame = GameFactory.withGrid(
      realPlayerGame.getGrid(),
      DIMENSION
    );
    const newGame = { id: this.gameId++, realPlayerGame, aiPlayerGame };
    this.games.push(newGame);

    return convertToGameDto(newGame);
  }

  nextMove(gameId: number, color: ColorId) {
    const game = this.games.find((g) => g.id === gameId);
    if (!game) {
      throw new ValidationError("No game found for given game id");
    }

    const isValidColor = COLORS.find(({ id }) => color === id) != null;
    if (!isValidColor) {
      throw new ValidationError("Please select a valid color");
    }

    const { realPlayerGame, aiPlayerGame } = game;

    realPlayerGame.nextMove(color);

    // Make AI move as well
    if (!aiPlayerGame.isGameOver()) {
      const nextColor = AiPlayer.calculateNextMove(
        aiPlayerGame.getGrid(),
        DIMENSION
      );
      aiPlayerGame.nextMove(nextColor);
    }

    // Remove game from array if over
    if (realPlayerGame.isGameOver()) {
      const gameIndex = this.games.findIndex((g) => g.id === gameId);
      this.games.splice(gameIndex, 1);
    }

    return convertToGameDto(game);
  }

  gameCount() {
    return this.games.length;
  }
}
